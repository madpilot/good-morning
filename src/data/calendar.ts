"use server";

import { DAVClient, getBasicAuthHeaders } from "tsdav";
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
};

export async function fetchEvents(
  config: iCloudAccountConfig,
  startDay: DateTime = DateTime.now().startOf("week"),
  endDay: DateTime = DateTime.now().endOf("week")
): Promise<Array<CalendarEvent>> {
  const client = auth(config);
  await client.login();

  const calendars = await client.fetchCalendars();
  const family = calendars.find((calendar) =>
    config.calendars.includes(calendar.url)
  );
  if (!family) {
    console.warn("Family calendar not found");
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

  const objects = await client.fetchCalendarObjects({
    calendar: family,
    timeRange: {
      start: start,
      end: end,
    },
  });

  const parsed = objects.map((object) =>
    new IcalExpander({ ics: object.data, maxIterations: 100 }).between(
      new Date(start),
      new Date(end)
    )
  );

  return parsed.reduce<Array<CalendarEvent>>((acc, expended) => {
    return [
      ...acc,
      ...expended.events.map((event) => ({
        start: event.startDate.toJSDate().toISOString(),
        end: event.endDate.toJSDate().toISOString(),
        title: event.summary,
      })),
      ...expended.occurrences.map((occurrence) => ({
        start: occurrence.startDate.toJSDate().toISOString(),
        end: occurrence.endDate.toJSDate().toISOString(),
        title: occurrence.item.summary,
      })),
    ];
  }, []);
}
