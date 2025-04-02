import { DateTime } from "luxon";
import { salutation } from "./salutation";

describe("salutation", () => {
  it.each([
    ["00:00", "Good Morning!"],
    ["11:59", "Good Morning!"],
    ["12:00", "Good Afternoon!"],
    ["16:59", "Good Afternoon!"],
    ["17:00", "Good Evening!"],
    ["19:59", "Good Evening!"],
    ["20:00", "Good Night!"],
    ["23:59", "Good Night!"],
  ])("At %s the salutation is %s", (time, expected) => {
    expect(salutation(DateTime.fromISO(time))).toEqual(expected);
  });
});
