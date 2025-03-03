import { DateTime } from "luxon";
import { CalendarEvent } from "../calendar";

export interface ICalendarAdapter {
  fetchEvents(
    startDay: DateTime,
    endDay: DateTime
  ): Promise<Array<CalendarEvent>>;
}
