export function formatTo12Hour(time24?: string | null) {
  if (!time24) return ""; 
  const parts = time24.split(":");
  if (parts.length < 2) return time24;

  const [hoursRaw, minutesRaw] = parts;
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);

  if (isNaN(hours) || isNaN(minutes)) return time24; 

  const suffix = hours >= 12 ? "PM" : "AM";
  const hours12 = ((hours + 11) % 12) + 1; 

  return `${hours12.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${suffix}`;
}
