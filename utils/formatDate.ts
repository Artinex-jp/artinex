export function formatDate(input: string | Date, format: string): string {
  const date = input instanceof Date ? input : new Date(input);
  if (isNaN(date.getTime())) return "Invalid Date";

  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];

  const replacements: { [key: string]: string } = {
    yyyy: date.getFullYear().toString(),
    yy: date.getFullYear().toString().slice(-2),
    mm: String(date.getMonth() + 1).padStart(2, "0"),
    m: (date.getMonth() + 1).toString(),
    dd: String(date.getDate()).padStart(2, "0"),
    d: date.getDate().toString(),
    E: dayNames[date.getDay()],
    hh: String(date.getHours()).padStart(2, "0"),
    h: date.getHours().toString(),
    MM: String(date.getMinutes()).padStart(2, "0"),
    ss: String(date.getSeconds()).padStart(2, "0"),
  };

  return format.replace(/yyyy|yy|mm|m|dd|d|E|hh|h|MM|ss/g, (match) => replacements[match]);
}