"use client";

import { DateTime } from "luxon";
import { useEffect, useState } from "react";

type TimeProps = {
  className?: string;
};

export function Time({ className }: TimeProps) {
  const [time, updateTime] = useState<string>(
    DateTime.now().toFormat("h:mm a")
  );

  useEffect(() => {
    const id = setInterval(
      () => updateTime(DateTime.now().toFormat("h:mm a")),
      500
    );
    return () => clearInterval(id);
  }, []);

  return <div className={className}>{time}</div>;
}
