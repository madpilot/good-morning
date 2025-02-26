"use client";

import { DateTime } from "luxon";
import { useEffect, useState } from "react";

type TimeProps = {
  className?: string;
};

export function Date({ className }: TimeProps) {
  const [date, updateDate] = useState<string>(
    DateTime.now().toFormat("MMM dd, yyyy")
  );

  useEffect(() => {
    const id = setInterval(
      () => updateDate(DateTime.now().toFormat("MMM dd, yyyy")),
      500
    );
    return () => clearInterval(id);
  }, []);

  return <div className={className}>{date}</div>;
}
