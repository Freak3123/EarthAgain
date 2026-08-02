import { connectDB } from "@/config/mongoDB/connectDB";
import { FormSettings } from "@/lib/models/formSettings";

export type FormCategoryKey =
  | "registration"
  | "volunteer"
  | "partner"
  | "chapter";

// There is exactly one settings document; findOneAndUpdate with an empty
// filter/update and upsert creates it on first use and returns it thereafter.
export async function getFormSettings() {
  await connectDB();
  return FormSettings.findOneAndUpdate(
    {},
    {},
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

export async function isFormLive(key: FormCategoryKey): Promise<boolean> {
  const settings = await getFormSettings();
  return settings.masterLive && settings[key];
}
