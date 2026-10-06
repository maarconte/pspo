export interface RichTextEditorProps {
  /** HTML content. Read once on mount (uncontrolled afterwards); remount with a `key` to reset. */
  value: string;
  /** Called with the HTML, or an empty string when the editor holds no text. */
  onChange: (html: string) => void;
  id?: string;
  placeholder?: string;
}
