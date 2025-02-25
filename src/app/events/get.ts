import { readConfig } from "@/config";
import { CalendarEvent, fetchEvents } from "@/data/calendar";
import { DateTime } from "luxon";

export default async function getEvents(
  start: DateTime | undefined = undefined,
  end: DateTime | undefined = undefined
): Promise<Array<CalendarEvent>> {
  const config = await readConfig();
  const accounts = config.accounts;
  const allEvents = await Promise.allSettled(
    accounts.map(async (account) => await fetchEvents(account, start, end))
  );
  allEvents
    .filter((event) => event.status === "rejected")
    .forEach((event) => {
      console.error(`Unable to retrieve events from account: ${event.reason}`);
    });

  return allEvents
    .filter((event) => event.status === "fulfilled")
    .flatMap((event) => event.value);
}
