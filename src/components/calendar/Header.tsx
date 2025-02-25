import FullCalendar from "@fullcalendar/react";
import styles from "./header.module.css";
import { ThreeDot } from "react-loading-indicators";
import { DateTime } from "luxon";
import { useCallback } from "react";

type DateProps = {
  calendar: FullCalendar | null;
};

type HeaderProps = {
  calendar: FullCalendar | null;
  isLoading: boolean;
};

function Date({ calendar }: DateProps) {
  if (!calendar) {
    return <></>;
  }

  const start = DateTime.fromJSDate(calendar.getApi().view.activeStart);
  const end = DateTime.fromJSDate(calendar.getApi().view.activeEnd).minus({
    days: 1,
  });

  return (
    <div className={styles.date}>
      {start.toFormat("MMM d")} – {end.toFormat("MMM d, yyyy")}
    </div>
  );
}

export function Header({ calendar, isLoading }: HeaderProps) {
  const onClickToday = useCallback(() => {
    if (calendar) {
      calendar.getApi().today();
    }
  }, [calendar]);

  const onClickPrevious = useCallback(() => {
    if (calendar) {
      calendar.getApi().prev();
    }
  }, [calendar]);

  const onClickNext = useCallback(() => {
    if (calendar) {
      calendar.getApi().next();
    }
  }, [calendar]);

  return (
    <header className={styles.header}>
      {isLoading && (
        <div className={styles.spinner}>
          <ThreeDot variant="pulsate" color="currentColor" size="small" />
        </div>
      )}
      <Date calendar={calendar} />

      <button type="button" className={styles.today} onClick={onClickToday}>
        Today
      </button>
      <button
        type="button"
        className={styles.previous}
        onClick={onClickPrevious}
      >
        &lt;
      </button>
      <button type="button" className={styles.next} onClick={onClickNext}>
        &gt;
      </button>
    </header>
  );
}
