import type { IBlockBorder } from "@/lib/models/site";
import { label as labelCls, checkbox as checkboxCls } from "@/components/admin/shared";

const DEFAULT_BORDER: IBlockBorder = { enabled: false, color: "#16a34a", width: 2 };

/**
 * Cross-cutting "section border" control, shown for every block type
 * regardless of content (border is presentation, not content — see
 * lib/blocks/registry.tsx renderBlock, which applies it generically).
 */
export default function BorderField({
  border,
  onChange,
}: {
  border: IBlockBorder | undefined;
  onChange: (border: IBlockBorder) => void;
}) {
  const value = border ?? DEFAULT_BORDER;

  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50/60 p-3.5">
      <label className="flex cursor-pointer items-center gap-2.5">
        <input
          type="checkbox"
          checked={value.enabled}
          onChange={(e) => onChange({ ...value, enabled: e.target.checked })}
          className={checkboxCls}
        />
        <span className="text-sm font-medium text-stone-700">
          Add a border around this section
        </span>
      </label>

      {value.enabled && (
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={value.color}
                onChange={(e) => onChange({ ...value, color: e.target.value })}
                className="h-9 w-11 shrink-0 cursor-pointer rounded-md border border-stone-200 bg-white p-1"
              />
              <input
                type="text"
                value={value.color}
                onChange={(e) => onChange({ ...value, color: e.target.value })}
                placeholder="#16a34a"
                className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/25"
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Size (px)</label>
            <input
              type="number"
              min={1}
              max={20}
              value={value.width}
              onChange={(e) =>
                onChange({ ...value, width: Math.max(1, Math.min(20, Number(e.target.value) || 1)) })
              }
              className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/25"
            />
          </div>
        </div>
      )}
    </div>
  );
}
