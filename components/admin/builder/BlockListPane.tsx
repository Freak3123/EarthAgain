"use client";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  Plus,
} from "lucide-react";
import type { IBlock, BlockType } from "@/lib/models/site";
import { blockRegistry, blockTypeOrder } from "@/lib/blocks/registry";

/**
 * Left pane: the ordered block list (design §4). Reorder is up/down move
 * buttons rather than drag-and-drop — same end result (explicit, keyboard-
 * operable reordering) without pulling in a DnD dependency for a 9-type list.
 */
export default function BlockListPane({
  blocks,
  selectedId,
  onSelect,
  onToggleHidden,
  onDuplicate,
  onDelete,
  onMove,
  onAdd,
}: {
  blocks: IBlock[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggleHidden: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: "up" | "down") => void;
  onAdd: (type: BlockType) => void;
}) {
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-1.5 overflow-y-auto p-3">
        {blocks.map((block, i) => {
          const entry = blockRegistry[block.type];
          if (!entry) return null;
          const Icon = entry.icon;
          const active = block.id === selectedId;
          return (
            <div
              key={block.id}
              onClick={() => onSelect(block.id)}
              className={`group cursor-pointer rounded-lg border p-2.5 transition ${
                active
                  ? "border-green-600 bg-green-50/70 shadow-sm"
                  : "border-stone-200 bg-white hover:border-stone-300"
              } ${block.hidden ? "opacity-50" : ""}`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${
                    active ? "bg-[#79b727] text-white" : "bg-stone-100 text-stone-500"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-stone-800">
                  {entry.label}
                </span>
              </div>
              <div
                className="mt-2 flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <IconBtn
                  onClick={() => onMove(block.id, "up")}
                  disabled={i === 0}
                  label="Move up"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn
                  onClick={() => onMove(block.id, "down")}
                  disabled={i === blocks.length - 1}
                  label="Move down"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn
                  onClick={() => onToggleHidden(block.id)}
                  label={block.hidden ? "Show" : "Hide"}
                >
                  {block.hidden ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </IconBtn>
                <IconBtn onClick={() => onDuplicate(block.id)} label="Duplicate">
                  <Copy className="h-3.5 w-3.5" />
                </IconBtn>
                <IconBtn
                  onClick={() => onDelete(block.id)}
                  label="Delete"
                  danger
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </IconBtn>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative border-t border-stone-200 p-3">
        <button
          type="button"
          onClick={() => setPaletteOpen((v) => !v)}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-stone-300 py-2.5 text-sm font-medium text-stone-600 transition hover:border-green-500 hover:text-green-700"
        >
          <Plus className="h-4 w-4" />
          Add section
        </button>

        {paletteOpen && (
          <div className="absolute inset-x-3 bottom-full z-10 mb-2 max-h-80 overflow-y-auto rounded-xl border border-stone-200 bg-white p-1.5 shadow-lg">
            {blockTypeOrder.map((type) => {
              const entry = blockRegistry[type];
              const Icon = entry.icon;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    onAdd(type);
                    setPaletteOpen(false);
                  }}
                  className="flex w-full cursor-pointer items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition hover:bg-stone-50"
                >
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-green-50 text-green-700">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-stone-800">
                      {entry.label}
                    </span>
                    <span className="block text-xs text-stone-500">{entry.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function IconBtn({
  onClick,
  children,
  label,
  disabled,
  danger,
}: {
  onClick: () => void;
  children: React.ReactNode;
  label: string;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`inline-flex cursor-pointer items-center justify-center rounded-md p-1.5 text-stone-400 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-30 ${
        danger ? "hover:bg-red-50 hover:text-red-600" : "hover:text-stone-700"
      }`}
    >
      {children}
    </button>
  );
}
