"use client";

import { Config } from "@/config";
import FullCalendarKlass from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { DateTime } from "luxon";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

type FullCalendarProps = {
  config: Config;
};

// Fifteen minutes
const RELOAD_TIME = 900 as const;
export default function FullCalendar({ config }: FullCalendarProps) {
  const calendarRef = useRef<FullCalendarKlass>(null);
  const [scrollTime, setScrollTime] = useState<string>(
    DateTime.now().startOf("hour").toFormat("HH:mm:ss")
  );

  useEffect(() => {
    const id = setInterval(() => {
      if (calendarRef?.current) {
        calendarRef.current.getApi().refetchEvents();
      }
      setScrollTime(DateTime.now().startOf("hour").toFormat("HH:mm:ss"));
    }, RELOAD_TIME * 1000);

    return () => clearInterval(id);
  }, [setScrollTime]);

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
      ref={calendarRef}
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
      events="/events"
    />
  );
}
