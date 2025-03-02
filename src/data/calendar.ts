"use server";

import { DAVCalendar, DAVClient, getBasicAuthHeaders } from "tsdav";
import { DateTime } from "luxon";
import { iCloudAccountConfig } from "@/config";
import IcalExpander from "ical-expander";

function auth(config: iCloudAccountConfig): DAVClient {
  return new DAVClient({
    serverUrl: "https://caldav.icloud.com",
    credentials: {
      username: config.username,
      password: config.password,
    },
    authMethod: "Custom",
    defaultAccountType: "caldav",
    authFunction: async (credentials) => {
      return {
        ...getBasicAuthHeaders(credentials),
        "accept-language": "en_AU,en;q=0.5",
      };
    },
  });
}

export async function fetchCalendars(
  config: iCloudAccountConfig
): Promise<Array<string>> {
  const client = auth(config);
  await client.login();

  const calendars = await client.fetchCalendars();
  return calendars.map(({ displayName }) => {
    if (typeof displayName === "string") {
      return displayName;
    } else {
      return "Unknown";
    }
  });
}

export type CalendarEvent = {
  title: string;
  start: string;
  end: string;
  slug?: string | undefined;
};

export async function fetchEvents(
  config: iCloudAccountConfig,
  startDay: DateTime = DateTime.now().startOf("week"),
  endDay: DateTime = DateTime.now().endOf("week")
): Promise<Array<CalendarEvent>> {
  const client = auth(config);
  await client.login();

  const davCalendars = await client.fetchCalendars();
  const configCalendars = config.calendars.map<{
    url: string;
    color?: string;
    slug?: string;
  }>((calendar) =>
    typeof calendar === "string" ? { url: calendar } : calendar
  );

  const found = davCalendars.reduce<
    Array<DAVCalendar & { slug?: string | undefined }>
  >((acc, calendar) => {
    configCalendars.forEach((check) => {
      if (check.url === calendar.url) {
        acc.push({
          ...calendar,
          slug: check.slug,
        });
      }
    });
    return acc;
  }, []);

  if (found.length === 0) {
    return [];
  }

  const start = startDay.toISO();
  const end = endDay.toISO();

  if (!start) {
    throw new Error("Invalid start date");
  }
  if (!end) {
    throw new Error("Invalid end date");
  }

  const objects = await Promise.all(
    found.map(async (calendar) =>
      (
        await client.fetchCalendarObjects({
          calendar: calendar,
          timeRange: {
            start: start,
            end: end,
          },
        })
      ).map((calendarEvent) => ({
        ...calendarEvent,
        slug: calendar.slug,
      }))
    )
  );

  const parsed = objects.flat().map((object) => {
    const expanded = new IcalExpander({
      ics: object.data,
      maxIterations: 100,
    }).between(new Date(start), new Date(end));
    return {
      ...expanded,
      slug: object.slug,
    };
  });

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
