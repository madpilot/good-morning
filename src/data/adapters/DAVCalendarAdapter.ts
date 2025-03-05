import { DateTime } from "luxon";
import { CalendarEvent } from "../calendar";
import { ICalendarAdapter } from "./ICalendarAdapter";
import { CalendarConfig } from "@/config";
import { DAVCalendar, DAVClient, DAVObject } from "tsdav";
import IcalExpander from "ical-expander";

type Decorated<T> = T & { slug?: string | undefined };
type NormalizedConfig = {
  url: string;
  slug?: string;
};
type ParsedEvents = ReturnType<InstanceType<typeof IcalExpander>["between"]>;

export class DAVCalendarAdapter implements ICalendarAdapter {
  constructor(private client: DAVClient, private config: CalendarConfig) {}

  private normalizeConfiguration(): Array<NormalizedConfig> {
    return this.config.map<NormalizedConfig>((calendar) =>
      typeof calendar === "string" ? { url: calendar } : calendar
    );
  }

  private filterCalendars(
    allCalendars: Array<DAVCalendar>
  ): Array<Decorated<DAVCalendar>> {
    const configCalendars = this.normalizeConfiguration();
    return allCalendars.reduce<Array<Decorated<DAVCalendar>>>(
      (acc, calendar) => {
        const configCalendar = configCalendars.find(
          (check) => check.url === calendar.url
        );
        if (configCalendar) {
          acc.push({ ...calendar, slug: configCalendar.slug });
        }
        return acc;
      },
      []
    );
  }

  private async fetchCalendarEvents(
    start: string,
    end: string,
    calendars: Decorated<DAVCalendar>[]
  ): Promise<Decorated<DAVObject>[]> {
    return (
      await Promise.all(
        calendars.map(async (calendar) => {
          const fetched = await this.client.fetchCalendarObjects({
            calendar: calendar,
            timeRange: {
              start: start,
              end: end,
            },
          });

          return fetched.map<Decorated<DAVObject>>((calendarEvent) => ({
            ...calendarEvent,
            slug: calendar.slug,
          }));
        })
      )
    ).flat();
  }

  private parseEvents(
    start: string,
    end: string,
    events: Array<Decorated<DAVObject>>
  ): Array<Decorated<ParsedEvents>> {
    return events.map((event) => {
      const expanded = new IcalExpander({
        ics: event.data,
        maxIterations: 100,
      }).between(new Date(start), new Date(end));

      return {
        ...expanded,
        slug: event.slug,
      } satisfies Decorated<ParsedEvents>;
    });
  }

  private transform(
    parsed: Array<Decorated<ParsedEvents>>
  ): Array<CalendarEvent> {
    return parsed.reduce<Array<CalendarEvent>>((acc, expanded) => {
      return [
        ...acc,
        ...expanded.events.map<CalendarEvent>((event) => ({
          start: event.startDate.toJSDate().toISOString(),
          end: event.endDate.toJSDate().toISOString(),
          title: event.summary,
          slug: expanded.slug,
        })),
        ...expanded.occurrences.map<CalendarEvent>((occurrence) => ({
          start: occurrence.startDate.toJSDate().toISOString(),
          end: occurrence.endDate.toJSDate().toISOString(),
          title: occurrence.item.summary,
          slug: expanded.slug,
        })),
      ];
    }, []);
  }

  async fetchEvents(
    startDay: DateTime,
    endDay: DateTime
  ): Promise<Array<CalendarEvent>> {
    const start = startDay.toISO();
    const end = endDay.toISO();

    if (!start) {
      throw new Error("Invalid start date");
    }
    if (!end) {
      throw new Error("Invalid end date");
    }

    await this.client.login();

    const davCalendars = await this.client.fetchCalendars();
    const filtered = this.filterCalendars(davCalendars);

    if (filtered.length === 0) {
      return [];
    }

    const events = await this.fetchCalendarEvents(start, end, filtered);
    const parsed = this.parseEvents(start, end, events);
    return this.transform(parsed);
  }
}
