export function formatDate(raw: string, format: string): string {
  // 時刻のみの場合、仮の日付を補う
  const isTimeOnly = /^\d{2}:\d{2}:\d{2}(?:\+\d{2}(?::\d{2})?)?$/.test(raw);
  let padded = raw;
  console.log(padded)
  if (isTimeOnly) {
      const withFullOffset = raw.replace(
          /(\d{2}:\d{2}:\d{2})(\+\d{2})$/,
          (_match, time, offsetHour) => `${time}${offsetHour}:00`
      );
    console.log(padded)
    padded = `2000-01-01T${withFullOffset}`;
  }

  const date = new Date(padded);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date string");
  }

  // 日付を使ったフォーマット指定子を含んでいたら、時刻専用入力ではエラーにする
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