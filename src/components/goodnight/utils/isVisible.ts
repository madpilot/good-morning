import { DateTime } from "luxon";

export function isVisible(
  start: string,
  end: string,
  now = DateTime.now()
): boolean {
  const nowTime = now.toISOTime({
    includeOffset: false,
    suppressSeconds: true,
    suppressMilliseconds: true,
  });

  // start and end times are in the same day
  if (end > start) {
    return nowTime >= start && nowTime < end;
  }

  // end times are in the next day
  return (
    (nowTime >= start && nowTime < "24:00") ||
    (nowTime >= "00:00" && nowTime < end)
  );
}
