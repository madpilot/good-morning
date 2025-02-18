"use client";

import { Config } from "@/config";
import { CalendarEvent } from "@/data/calendar";
import FullCalendarKlass from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";

type FullCalendarProps = {
  events: Array<CalendarEvent>;
  config: Config;
};

// Fifteen minutes
const RELOAD_TIME = 900 as const;

export async function getStaticProps() {
  return {
    revalidate: RELOAD_TIME,
  };
}

export default function FullCalendar({ events, config }: FullCalendarProps) {
  const router = useRouter();
  const [scrollTime, setScrollTime] = useState<string>(
    DateTime.now().startOf("hour").toFormat("HH:mm:ss")
  );

  useEffect(() => {
    const id = setInterval(() => {
      router.refresh();
      setScrollTime(DateTime.now().startOf("hour").toFormat("HH:mm:ss"));
    }, RELOAD_TIME * 1000);

    return () => clearInterval(id);
  }, [router, setScrollTime]);

  useLayoutEffect(() => {
    // Heh, this is terrible...
    const styleEl = document.createElement("style");
    styleEl.textContent = config.users
      .map((user) => {
        const color = user.color || "var(--default-avatar-color)";
        return `
        .fc-v-event.user-${user.name.toLowerCase()} {
          background-color: ${color};
          border-color: ${color};
        }
      `;
      })
      .join("\n");
    document.head.append(styleEl);
    return () => styleEl.remove();
  }, [config]);

  return (
    <FullCalendarKlass
      plugins={[timeGridPlugin]}
      initialView="timeGridWeek"
      themeSystem="standard"
      nowIndicator={true}
      headerToolbar={{ left: "", right: "title today prev,next" }}
      scrollTime={scrollTime}
      dayHeaderContent={(args) => {
        const date = DateTime.fromJSDate(args.date);

        return (
          <>
            {date.toFormat("EEE")}{" "}
            <span className="fc-day-today-highlight">
              {date.toFormat("dd")}
            </span>
          </>
        );
      }}
      eventClassNames={(args) => {
        return (
          config.users.reduce<string | undefined>((className, user) => {
            const names = [user.name, ...(user.nicknames ?? [])];
            if (args.event.title.match(new RegExp(names.join("|"), "i"))) {
              return `user-${user.name.toLowerCase()}`;
            }
            return className;
          }, undefined) ?? ""
        );
      }}
      events={events}
    />
  );
}
