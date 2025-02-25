import FullCalendar from "@/wrapper/FullCalendar";
import "./calendar.css";
import { Metadata } from "next";
import { readConfig } from "@/config";

export default async function Calendar(): Promise<React.ReactElement> {
  const config = await readConfig();
  return (
    <>
      <FullCalendar config={config} />
    </>
  );
}

export const metadata: Metadata = {
  title: "Calendar - Good Morning!",
};
