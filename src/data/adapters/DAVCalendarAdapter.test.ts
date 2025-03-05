import { DAVClient } from "tsdav";
import { DAVCalendarAdapter } from "./DAVCalendarAdapter";
import { CalendarConfig } from "@/config";
import { DateTime } from "luxon";
import { DavCalendarFactory } from "@/tests/factories/DavCalendarFactory";
import { faker } from "@faker-js/faker";
import { DavObjectFactory } from "@/tests/factories/DavObjectFactory";

const mockClient = {
  login: jest.fn(),
  fetchCalendars: jest.fn(),
  fetchCalendarObjects: jest.fn(),
} as unknown as DAVClient;

describe("DAVCalendarAdapter", () => {
  let config: CalendarConfig;
  let startDay: DateTime;
  let endDay: DateTime;

  const instance = () => new DAVCalendarAdapter(mockClient, config);

  describe("fetchEvents", () => {
    const subject = async () => instance().fetchEvents(startDay, endDay);

    describe("Matching calendars by URL", () => {
      describe("Empty calendars", () => {
        it("returns an empty array of events", async () => {
          config = [];
          (mockClient.fetchCalendars as jest.Mock).mockResolvedValue(
            DavCalendarFactory.buildList(2)
          );
          startDay = DateTime.now().startOf("week");
          endDay = DateTime.now().endOf("week");
          const results = await subject();
          expect(results).toHaveLength(0);
        });
      });

      describe("No matching calendars", () => {
        it("returns an empty array of events", async () => {
          config = [
            {
              url: faker.internet.url(),
              slug: "calendar-1",
            },
            {
              url: faker.internet.url(),
              slug: "calendar-2",
            },
          ];
          (mockClient.fetchCalendars as jest.Mock).mockResolvedValue(
            DavCalendarFactory.buildList(2)
          );
          startDay = DateTime.now().startOf("week");
          endDay = DateTime.now().endOf("week");
          const results = await subject();
          expect(results).toHaveLength(0);
        });
      });

      describe("Matching calendars", () => {
        it("returns an array of events", async () => {
          const calendarOne = faker.internet.url();
          const calendarThree = faker.internet.url();
          config = [
            {
              url: calendarOne,
              slug: "calendar-1",
            },
            {
              url: faker.internet.url(),
              slug: "calendar-2",
            },
            {
              url: calendarThree,
              slug: "calendar-3",
            },
          ];
          (mockClient.fetchCalendars as jest.Mock).mockResolvedValue([
            DavCalendarFactory.build({ url: calendarOne }),
            DavCalendarFactory.build(),
            DavCalendarFactory.build({ url: calendarThree }),
          ]);
          (mockClient.fetchCalendarObjects as jest.Mock)
            .mockResolvedValueOnce([
              DavObjectFactory.build({ url: calendarOne }),
            ])
            .mockResolvedValueOnce([
              DavObjectFactory.build({ url: calendarThree }),
            ]);

          startDay = DateTime.now().startOf("week");
          endDay = DateTime.now().endOf("week");
          const results = await subject();
          expect(results).toHaveLength(2);
        });
      });
    });
  });
});
