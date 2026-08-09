import { RegEvent, IRegEvent } from "@/lib/models/regevent";

/**
 * The one day format shared by the register form, the stored
 * `registrationDays`, and every lookup here — e.g. "6 Oct 2025". Changing it
 * would orphan existing registrations, which store the label rather than a date.
 */
export function dayLabel(date: Date | string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Every session scheduled on the given days, resolved at read time rather than
 * stored — that is what makes "only dates" registrations pick up sessions added
 * after someone registered. "all" means every day.
 */
export async function eventsOnDays(days: string[]): Promise<IRegEvent[]> {
  if (!days || days.length === 0) return [];

  const events = await RegEvent.find({}).sort({ date: 1, time: 1 });
  if (days.includes("all")) return events;

  return events.filter((ev) => days.includes(dayLabel(ev.date)));
}

export { formatTo12Hour } from "@/lib/formatTime";
