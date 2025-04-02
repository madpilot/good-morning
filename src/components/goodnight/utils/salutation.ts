import { DateTime } from "luxon";

export function salutation(now: DateTime = DateTime.now()): string {
  if (now.hour >= 0 && now.hour < 12) {
    return "Good Morning!";
  }

  if (now.hour >= 12 && now.hour < 17) {
    return "Good Afternoon!";
  }

  if (now.hour >= 17 && now.hour < 20) {
    return "Good Evening!";
  }

  return "Good Night!";
}
