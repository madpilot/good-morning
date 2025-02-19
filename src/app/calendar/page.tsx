import { fetchEvents } from "@/data/calendar";
import FullCalendar from "@/wrapper/FullCalendar";
import "./calendar.css";
import { readConfig } from "@/config";
import { Metadata } from "next";

export default async function Calendar(): Promise<React.ReactElement> {
  const config = await readConfig();
  const accounts = config.accounts;
  const allEvents = await Promise.allSettled(
    accounts.map(async (account) => await fetchEvents(account))
  );
  allEvents
    .filter((event) => event.status === "rejected")
    .forEach((event) => {
      console.error(`Unable to retrieve events from account: ${event.reason}`);
    });

  const events = allEvents
    .filter((event) => event.status === "fulfilled")
    .flatMap((event) => event.value);

  return (
    <>
      <FullCalendar events={events} config={config} />
    </>
  );
}

export const metadata: Metadata = {
  title: "Calendar - Good Morning!",
};
