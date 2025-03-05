import { Factory } from "fishery";
import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";

function generateICS(
  sequence: number,
  summary: string,
  description: string,
  timezone: string,
  startDate: DateTime,
  endDate: DateTime
): string {
  return `BEGIN:VCALENDAR
VERSION:2.0
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:${summary}
DTSTART;TZID=${timezone}:${startDate.toFormat("yyyyLLdd'T'HHmmss")}
DTEND;TZID=${timezone}:${endDate.toFormat("yyyyLLdd'T'HHmmss")}
DESCRIPTION:${description}
STATUS:CONFIRMED
SEQUENCE:${sequence}
END:VEVENT
END:VCALENDAR`;
}

export const ICSFactory = Factory.define<
  string,
  {
    summary: string;
    description: string;
    timezone: string;
    startDate: DateTime;
    endDate: DateTime;
  }
>(({ sequence, transientParams }) =>
  generateICS(
    sequence,
    transientParams.summary || faker.word.words(3),
    transientParams.description || faker.word.words(10),
    transientParams.timezone || faker.location.timeZone(),
    transientParams.startDate || DateTime.now().minus({ hours: 1 }),
    transientParams.endDate || DateTime.now()
  )
);
