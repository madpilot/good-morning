import ICAL from "ical.js";

declare module "ical-expander";
declare interface IcalExpanderResults {
  events: ICAL.Event[];
  occurrences: {
    recurrenceId: Time;
    item: ICAL.Event;
    startDate: Time;
    endDate: Time;
  }[];
}

declare interface IcalExpanderOptions {
  ics: string;
  maxIterations?: number;
  skipInvalidDates?: boolean;
}

declare class IcalExpander {
  constructor(opts: IcalExpanderOptions);
  between(after?: Date, before?: Date): IcalExpanderResults;
  before(before: Date): IcalExpanderResults;
  after(after: Date): IcalExpanderResults;
  all(): IcalExpanderResults;
}

export default IcalExpander;
