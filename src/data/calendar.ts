"use server";

import { DateTime } from "luxon";
import { iCloudAccountConfig } from "@/config";
import { DAVCalendarAdapter } from "./adapters/DAVCalendarAdapter";
import { iCloudAuth } from "./auth/icloud";

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
  // This will eventually become a factory
  const adapter = new DAVCalendarAdapter(iCloudAuth(config), config.calendars);
  return adapter.fetchEvents(startDay, endDay);
}
