import { DAVClient } from "tsdav";
import { DAVCalendarAdapter } from "./DAVCalendarAdapter";
import { CalendarConfig } from "@/config";
import { DateTime } from "luxon";

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

    describe("Empty calendars", () => {
      it("returns an empty array of event", async () => {
        config = [];
        (mockClient.fetchCalendars as jest.Mock).mockResolvedValue([
          {
            url: "https://caldav.icloud.com/000000000/calendars/2581af30-5024-423e-81b9-48e905484424/",
          },
          {
            url: "https://caldav.icloud.com/000000000/calendars/ce7681fc-7c33-457d-bebb-31e7e0c690a8/",
          },
        ]);
        startDay = DateTime.now().startOf("week");
        endDay = DateTime.now().endOf("week");
        const results = await subject();
        expect(results).toHaveLength(0);
      });
    });
  });
});
