/**
 * Formats seconds into MM:SS or HH:MM:SS
 */
export function formatTime(totalSeconds: number): string {
  const isNegative = totalSeconds < 0;
  const absSeconds = Math.abs(Math.floor(totalSeconds));

  const hours = Math.floor(absSeconds / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);
  const seconds = absSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');

  const formatted = hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(minutes)}:${pad(seconds)}`;

  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Formats seconds into compact readable human text like "1h 30m" or "45m"
 */
export function formatHumanDuration(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return '0m';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  return `${minutes}m`;
}

/**
 * Parses user input like "1.5h", "1h 30m", "45m", "90", "1.5" into total seconds
 */
export function parseDurationInput(input: string): number {
  if (!input || !input.trim()) return 0;
  const clean = input.trim().toLowerCase();

  // Pattern like "1h 30m", "1h30m", "2h", "45m", "30min"
  let totalMinutes = 0;

  const hrMatch = clean.match(/([\d.]+)\s*(?:h|hr|hours?)/);
  const minMatch = clean.match(/([\d.]+)\s*(?:m|min|mins?|minutes?)/);

  if (hrMatch) {
    totalMinutes += parseFloat(hrMatch[1]) * 60;
  }
  if (minMatch) {
    totalMinutes += parseFloat(minMatch[1]);
  }

  // If no unit was matched, check if it's pure decimal/number
  if (!hrMatch && !minMatch) {
    const num = parseFloat(clean);
    if (!isNaN(num)) {
      // If someone wrote "1.5", treat as hours if <= 12, or if > 12 treat as minutes?
      // Better convention: if contains decimal point like "1.5", treat as hours, otherwise if >= 15 treat as minutes
      if (clean.includes('.')) {
        totalMinutes = num * 60;
      } else if (num < 10) {
        totalMinutes = num * 60; // 1 -> 1h, 2 -> 2h, 3 -> 3h
      } else {
        totalMinutes = num; // 30 -> 30m, 45 -> 45m
      }
    }
  }

  return Math.round(totalMinutes * 60);
}
