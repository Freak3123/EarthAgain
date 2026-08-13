"use client";
import { useEffect } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link2,
  Link2Off,
  Undo2,
  Redo2,
} from "lucide-react";

/** One toolbar button. `active` mirrors the mark under the caret. */
const ToolButton = ({
  icon: Icon,
  title,
  active,
  disabled,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    title={title}
    aria-label={title}
    aria-pressed={active}
    disabled={disabled}
    onClick={onClick}
    className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
      active
        ? "bg-[#79b727] text-white"
        : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
    }`}
  >
    <Icon className="h-4 w-4" />
  </button>
);

const Divider = () => <div className="mx-1 h-5 w-px bg-stone-200" />;

const Toolbar = ({ editor }: { editor: Editor }) => {
  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");
    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url.trim() })
      .run();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-stone-200 bg-stone-50/60 px-2 py-1.5">
      <ToolButton
        icon={Bold}
        title="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolButton
        icon={Italic}
        title="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolButton
        icon={Underline}
        title="Underline"
        active={editor.isActive("underline")}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      <ToolButton
        icon={Strikethrough}
        title="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />
      <Divider />
      <ToolButton
        icon={Heading2}
        title="Heading"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
      />
      <ToolButton
        icon={Heading3}
        title="Subheading"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
      />
      <Divider />
      <ToolButton
        icon={List}
        title="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolButton
        icon={ListOrdered}
        title="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <ToolButton
        icon={Quote}
        title="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
      <ToolButton
        icon={Minus}
        title="Divider"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      />
      <Divider />
      <ToolButton
        icon={Link2}
        title="Add link"
        active={editor.isActive("link")}
        onClick={setLink}
      />
      <ToolButton
        icon={Link2Off}
        title="Remove link"
        disabled={!editor.isActive("link")}
        onClick={() => editor.chain().focus().unsetLink().run()}
      />
      <Divider />
      <ToolButton
        icon={Undo2}
        title="Undo"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      />
      <ToolButton
        icon={Redo2}
        title="Redo"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      />
    </div>
  );
};

/**
 * Rich-text editor for the blog body. Emits HTML, which the save endpoints
 * sanitise before storing (see lib/sanitizeHtml.ts) — this is an authoring
 * convenience, never the security boundary.
 */
export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write the article…",
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const editor = useEditor({
    // Rendered on the client only — avoids a hydration mismatch warning.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false, autolink: true },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "blog-content min-h-[260px] w-full px-4 py-3 text-sm text-stone-800 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      // Tiptap's empty document still stringifies to "<p></p>".
      onChange(html === "<p></p>" ? "" : html);
    },
  });

  // Loading a different post into the same mounted form (edit mode) has to
  // push the new body in — the editor holds its own document otherwise.
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || "<p></p>";
    if (current !== next) editor.commands.setContent(next, { emitUpdate: false });
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="min-h-[300px] rounded-lg border border-stone-200 bg-white" />
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-stone-200 bg-white focus-within:border-green-600 focus-within:ring-2 focus-within:ring-green-600/25">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
