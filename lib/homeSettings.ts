import { connectDB } from "@/config/mongoDB/connectDB";
import { HomeSettings } from "@/lib/models/homeSettings";

/**
 * Used until a superadmin sets one, and whenever the database is unreachable.
 * The offset is explicit: the conference starts 9am in Odisha, and without it
 * the instant would drift with whatever timezone the server happens to run in.
 */
export const DEFAULT_COUNTDOWN_TARGET = "2026-10-06T09:00:00+05:30";

// There is exactly one settings document; upsert creates it on first read and
// returns it thereafter.
export async function getHomeSettings() {
  await connectDB();
  return HomeSettings.findOneAndUpdate(
    {},
    { $setOnInsert: { countdownTarget: new Date(DEFAULT_COUNTDOWN_TARGET) } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

/**
 * The hero countdown's target as an ISO instant. Falls back to the default
 * rather than throwing — a database hiccup must not blank the home page.
 */
export async function getCountdownTarget(): Promise<string> {
  try {
    const settings = await getHomeSettings();
    return settings.countdownTarget.toISOString();
  } catch (error) {
    console.error("Failed to read home settings:", error);
    return new Date(DEFAULT_COUNTDOWN_TARGET).toISOString();
  }
}
