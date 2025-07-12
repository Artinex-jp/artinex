export function formatDate(raw: string, format: string): string {
  const isTimeOnly = /^\d{2}:\d{2}:\d{2}(?:\+\d{2})?$/.test(raw);
  let padded = raw;

  if (isTimeOnly) {
    padded = raw.replace(/^(\d{2}:\d{2}:\d{2})(\+\d{2})$/, (_, t, offset) => `${t}${offset}:00`);
    if (padded === raw) padded = raw;
    padded = `2000-01-01T${padded}`;
  }

  const date = new Date(padded);
  if (isNaN(date.getTime())) throw new Error("Invalid date string");

  // JSTで表示
  const dt = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: format.includes("YYYY") ? "numeric" : undefined,
    month: format.includes("MM") || format.includes("M") ? "2-digit" : undefined,
    day: format.includes("DD") || format.includes("D") ? "2-digit" : undefined,
    hour: format.includes("hh") || format.includes("h") ? "2-digit" : undefined,
    minute: format.includes("mm") || format.includes("m") ? "2-digit" : undefined,
    second: format.includes("ss") || format.includes("s") ? "2-digit" : undefined,
    weekday: format.includes("E") ? "short" : undefined,
    hour12: false,
  }).formatToParts(date);

  const map = Object.fromEntries(dt.map(({ type, value }) => [type, value]));
  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];

  return format
    .replace(/YYYY/g, map.year ?? "")
    .replace(/MM/g, map.month ?? "")
    .replace(/M/g, (map.month ?? "").replace(/^0/, ""))
    .replace(/DD/g, map.day ?? "")
    .replace(/D/g, (map.day ?? "").replace(/^0/, ""))
    .replace(/hh/g, map.hour ?? "")
    .replace(/h/g, (map.hour ?? "").replace(/^0/, ""))
    .replace(/mm/g, map.minute ?? "")
    .replace(/m/g, (map.minute ?? "").replace(/^0/, ""))
    .replace(/ss/g, map.second ?? "")
    .replace(/s/g, (map.second ?? "").replace(/^0/, ""))
    .replace(/E/g, dayNames[date.getDay()]);
}
