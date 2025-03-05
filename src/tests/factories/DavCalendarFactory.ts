import { Factory } from "fishery";
import { DAVCalendar } from "tsdav";
import { faker } from "@faker-js/faker";

export const DavCalendarFactory = Factory.define<DAVCalendar>(() => ({
  url: faker.internet.url(),
}));
