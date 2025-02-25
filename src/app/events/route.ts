import { DateTime } from "luxon";
import { NextRequest } from "next/server";
import getEvents from "./get";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const start = searchParams.has("start")
    ? DateTime.fromISO(searchParams.get("start") || "")
    : undefined;
  const end = searchParams.has("end")
    ? DateTime.fromISO(searchParams.get("end") || "")
    : undefined;

  const events = await getEvents(start, end);
  return Response.json(events);
}

// Invalidate every 15 minutes
export const revalidate = 900;
export const config = {};
