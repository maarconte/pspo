import { FC } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Link as LinkIcon, List, ListOrdered, Unlink } from "lucide-react";

import { RichTextEditorProps } from "./RichTextEditor.types";
import "./RichTextEditor.scss";

// Only formatting that SafeHtml's allowlist can render back (b, i, a, p, ul, ol, li).
const extensions = [
  StarterKit.configure({
    heading: false,
    blockquote: false,
    code: false,
    codeBlock: false,
    horizontalRule: false,
    strike: false,
    underline: false,
    link: {
      openOnClick: false,
      protocols: ["http", "https", "mailto"],
      HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
    },
  }),
];

const RichTextEditor: FC<RichTextEditorProps> = ({ value, onChange, id, placeholder }) => {
  const editor = useEditor({
    extensions,
    content: value,
    onUpdate: ({ editor: e }) => onChange(e.isEmpty ? "" : e.getHTML()),
    editorProps: {
      attributes: {
        ...(id ? { id } : {}),
        class: "rich-text-editor__content",
        "aria-label": placeholder ?? "Rich text editor",
      },
    },
  });

  const active = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e?.isActive("bold") ?? false,
      italic: e?.isActive("italic") ?? false,
      bulletList: e?.isActive("bulletList") ?? false,
      orderedList: e?.isActive("orderedList") ?? false,
      link: e?.isActive("link") ?? false,
    }),
  });

  if (!editor) return null;

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", previous ?? "https://");
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  const buttons = [
    { title: "Gras", icon: <Bold size={16} />, isActive: active?.bold, run: () => editor.chain().focus().toggleBold().run() },
    { title: "Italique", icon: <Italic size={16} />, isActive: active?.italic, run: () => editor.chain().focus().toggleItalic().run() },
    { title: "Liste à puces", icon: <List size={16} />, isActive: active?.bulletList, run: () => editor.chain().focus().toggleBulletList().run() },
    { title: "Liste numérotée", icon: <ListOrdered size={16} />, isActive: active?.orderedList, run: () => editor.chain().focus().toggleOrderedList().run() },
    { title: "Ajouter un lien", icon: <LinkIcon size={16} />, isActive: active?.link, run: setLink },
    { title: "Retirer le lien", icon: <Unlink size={16} />, isActive: false, disabled: !active?.link, run: () => editor.chain().focus().extendMarkRange("link").unsetLink().run() },
  ];

  return (
    <div className="rich-text-editor">
      <div className="rich-text-editor__toolbar" role="toolbar">
        {buttons.map(({ title, icon, isActive, disabled, run }) => (
          <button
            key={title}
            type="button"
            title={title}
            aria-label={title}
            aria-pressed={isActive}
            disabled={disabled}
            className={`rich-text-editor__btn ${isActive ? "rich-text-editor__btn--active" : ""}`}
            onClick={run}
          >
            {icon}
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
