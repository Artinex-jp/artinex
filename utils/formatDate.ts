export function formatDate(raw: string, format: string): string {
  const isTimeOnly = /^\d{2}:\d{2}:\d{2}(?:\+\d{2}(?::\d{2})?)?$/.test(raw);
  let padded = raw;

  if (isTimeOnly) {
    // タイムゾーンオフセットが "+09" の形式なら ":00" を補う
    padded = raw.replace(
      /^(\d{2}:\d{2}:\d{2})(\+\d{2})$/,
      (_match, time, offsetHour) => `${time}${offsetHour}:00`
    );

    // 変換されなかった場合（例：既に +09:00 の形式 or タイムゾーンなし）にも対応
    if (padded === raw) padded = raw;

    padded = `2000-01-01T${padded}`;
  }

  const date = new Date(padded);

  if (isNaN(date.getTime())) {
    console.log(raw)
    throw new Error("Invalid date string");
  }

  if (isTimeOnly && /[YMDE]/.test(format)) {
    throw new Error("Time-only string cannot be used with date-specific format tokens");
  }

  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];

  return format
    .replace(/YYYY/g, date.getFullYear().toString())
    .replace(/YY/g, date.getFullYear().toString().slice(-2))
    .replace(/MM/g, String(date.getMonth() + 1).padStart(2, "0"))
    .replace(/M/g, String(date.getMonth() + 1))
    .replace(/DD/g, String(date.getDate()).padStart(2, "0"))
    .replace(/D/g, String(date.getDate()))
    .replace(/E/g, dayNames[date.getDay()])
    .replace(/hh/g, String(date.getHours()).padStart(2, "0"))
    .replace(/h/g, String(date.getHours()))
    .replace(/mm/g, String(date.getMinutes()).padStart(2, "0"))
    .replace(/m/g, String(date.getMinutes()))
    .replace(/ss/g, String(date.getSeconds()).padStart(2, "0"))
    .replace(/s/g, String(date.getSeconds()));
}