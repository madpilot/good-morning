import { DateTime } from "luxon";
import { isVisible } from "./isVisible";

describe("isVisible", () => {
  let start: string;
  let end: string;
  let now: DateTime;

  describe("start and end in the same day", () => {
    const subject = () => isVisible(start, end, now);

    beforeEach(() => {
      start = "09:00";
      end = "14:00";
    });

    it("returns false when now is before the start time", () => {
      now = DateTime.fromISO("2025-02-27T08:59:59");
      const result = subject();
      expect(result).toEqual(false);
    });

    it("returns true when now is after the start time and before the end time", () => {
      now = DateTime.fromISO("2025-02-27T09:00:00");
      const result = subject();
      expect(result).toEqual(true);
    });

    it("returns false when now is after the end time", () => {
      now = DateTime.fromISO("2025-02-27T14:00:00");
      const result = subject();
      expect(result).toEqual(false);
    });
  });

  describe("start and end on different days", () => {
    const subject = () => isVisible(start, end, now);

    beforeEach(() => {
      start = "14:00";
      end = "09:00";
    });

    it("returns false when now is before the start time", () => {
      now = DateTime.fromISO("2025-02-27T13:59:59");
      const result = subject();
      expect(result).toEqual(false);
    });

    it("returns true when now is after the start time and before midnight", () => {
      now = DateTime.fromISO("2025-02-27T15:00:00");
      const result = subject();
      expect(result).toEqual(true);
    });

    it("returns true when now is after midnight and before the end time", () => {
      now = DateTime.fromISO("2025-02-28T01:00:00");
      const result = subject();
      expect(result).toEqual(true);
    });

    it("returns false when now is after the end time", () => {
      now = DateTime.fromISO("2025-02-27T09:00:00");
      const result = subject();
      expect(result).toEqual(false);
    });
  });
});
