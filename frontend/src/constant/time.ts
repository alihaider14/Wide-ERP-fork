export const HOURS_12 = Array.from({ length: 12 }, (_, i) =>
  String(i === 0 ? 12 : i).padStart(2, "0"),
);

export const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0"),
);

export const PERIODS = ["AM", "PM"] as const;
