export function convertDurationToDays(duration: string): number | null {
  switch (duration) {
    case "1_month":
      return 30; // Approximate days in a month
    case "6_months":
      return 180; // 6 months = 6 * 30 days
    case "1_year":
      return 365; // 1 year = 365 days
    default:
      return null; // Invalid duration
  }
}
