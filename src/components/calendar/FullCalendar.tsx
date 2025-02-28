"use client";

import { Config } from "@/config";
import FullCalendarKlass from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { DateTime } from "luxon";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ThreeDot } from "react-loading-indicators";

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

  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const id = setInterval(() => {
      const now = DateTime.now();
      if (calendarRef?.current) {
        calendarRef.current.getApi().gotoDate(now.toISO());
        calendarRef.current.getApi().refetchEvents();
      }
      setScrollTime(now.startOf("hour").toFormat("HH:mm:ss"));
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
    <>
      {isLoading && (
        <div className="fc fc-spinner">
          <ThreeDot
            variant="pulsate"
            color="currentColor"
            size="small"
            text=""
            textColor=""
          />
        </div>
      )}
      <FullCalendarKlass
        ref={calendarRef}
        plugins={[timeGridPlugin]}
        initialView="timeGridFourDay"
        views={{
          timeGridFourDay: {
            type: "timeGrid",
            dayCount: 4,
          },
        }}
        themeSystem="standard"
        nowIndicator={true}
        headerToolbar={false}
        scrollTime={scrollTime}
        loading={setLoading}
        dayHeaderContent={(args) => {
          const date = DateTime.fromJSDate(args.date);
          return (
            <>
              {date.toFormat("EEE")}{" "}
              <span className="fc-day-today-highlight">
                {date.toFormat("d")}
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
    </>
  );
}
