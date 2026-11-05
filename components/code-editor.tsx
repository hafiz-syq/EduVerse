// Pembungkus CodeMirror 6 untuk playground. Hanya dimuat lewat rute /koding (chunk
// terpisah) supaya pelajar yang tidak membuka lab tidak ikut menanggung ukuran bundel.
// Warna memakai custom property tema, jadi mode terang dan gelap ikut tanpa dua tema.
import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, drawSelection, dropCursor, highlightActiveLine, highlightActiveLineGutter, highlightSpecialChars, lineNumbers, rectangularSelection } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { bracketMatching, HighlightStyle, indentOnInput, syntaxHighlighting } from "@codemirror/language";
import { closeBrackets, closeBracketsKeymap } from "@codemirror/autocomplete";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { tags as t } from "@lezer/highlight";

export type Bahasa = "js" | "html" | "css";

const warna = (nama: string) => `var(${nama})`;

const gayaTeks = HighlightStyle.define([
  { tag: [t.comment, t.blockComment, t.lineComment], color: warna("--code-comment"), fontStyle: "italic" },
  { tag: [t.keyword, t.operatorKeyword, t.modifier, t.controlKeyword, t.moduleKeyword], color: warna("--code-keyword"), fontWeight: "600" },
  { tag: [t.string, t.special(t.string), t.regexp], color: warna("--code-string") },
  { tag: [t.number, t.bool, t.null, t.invalid], color: warna("--code-number") },
  { tag: [t.function(t.variableName), t.function(t.propertyName), t.macroName], color: warna("--code-function") },
  { tag: [t.typeName, t.className, t.namespace, t.definition(t.typeName)], color: warna("--code-type") },
  { tag: [t.propertyName, t.variableName, t.definition(t.variableName)], color: warna("--code-variable") },
  { tag: [t.operator, t.punctuation, t.separator], color: warna("--code-operator") },
  { tag: [t.tagName], color: warna("--code-keyword"), fontWeight: "600" },
  { tag: [t.attributeName], color: warna("--code-number") },
]);

const tema = EditorView.theme({
  "&": { backgroundColor: warna("--card"), color: warna("--foreground"), fontSize: "0.875rem", height: "100%" },
  ".cm-scroller": { fontFamily: warna("--font-mono"), lineHeight: "1.6", overflow: "auto" },
  ".cm-content": { caretColor: warna("--primary"), padding: "10px 0" },
  ".cm-cursor, .cm-dropCursor": { borderLeftColor: warna("--primary") },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
    backgroundColor: warna("--primary-soft"),
  },
  ".cm-gutters": {
    backgroundColor: warna("--secondary"),
    color: warna("--muted-foreground"),
    border: "none",
    borderRight: "1px solid var(--border)",
    minWidth: "2.5rem",
  },
  ".cm-lineNumbers .cm-gutterElement": { padding: "0 8px 0 10px" },
  ".cm-activeLine": { backgroundColor: "color-mix(in srgb, var(--primary) 7%, transparent)" },
  ".cm-activeLineGutter": { backgroundColor: "color-mix(in srgb, var(--primary) 12%, transparent)", color: warna("--foreground") },
  ".cm-matchingBracket, .cm-nonmatchingBracket": {
    backgroundColor: warna("--blush-soft"),
    color: warna("--foreground"),
    outline: "1px solid var(--blush)",
    borderRadius: "2px",
  },
});

const ekstensiUntuk = (bahasa: Bahasa, ariaLabel: string) => {
  const bahasaEkstensi = bahasa === "html" ? html() : bahasa === "css" ? css() : javascript({ jsx: false });
  return [
    lineNumbers(),
    highlightSpecialChars(),
    history(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    bracketMatching(),
    closeBrackets(),
    rectangularSelection(),
    highlightActiveLine(),
    highlightActiveLineGutter(),
    EditorView.lineWrapping,
    keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, indentWithTab]),
    bahasaEkstensi,
    syntaxHighlighting(gayaTeks),
    tema,
    EditorView.contentAttributes.of({ "aria-label": ariaLabel, "aria-multiline": "true", spellcheck: "false" }),
  ];
};

interface Props {
  value: string;
  bahasa: Bahasa;
  onChange: (value: string) => void;
  ariaLabel: string;
}

export function CodeEditor({ value, bahasa, onChange, ariaLabel }: Props) {
  const wadah = useRef<HTMLDivElement | null>(null);
  const tampilan = useRef<EditorView | null>(null);
  const nilai = useRef(value);
  const ubah = useRef(onChange);
  nilai.current = value;
  ubah.current = onChange;

  useEffect(() => {
    if (!wadah.current) return undefined;
    const view = new EditorView({
      state: EditorState.create({
        doc: nilai.current,
        extensions: [ekstensiUntuk(bahasa, ariaLabel), EditorView.updateListener.of((tr) => {
          if (tr.docChanged) ubah.current(view.state.doc.toString());
        })],
      }),
      parent: wadah.current,
    });
    tampilan.current = view;
    return () => {
      view.destroy();
      tampilan.current = null;
    };
  }, [bahasa, ariaLabel]);

  // Nilai dari luar (ganti tugas, tombol Reset, kirim dari Materi) ditulis tanpa
  // memindahkan kursor pengguna saat ia sedang mengetik.
  useEffect(() => {
    const view = tampilan.current;
    if (!view) return;
    const sekarang = view.state.doc.toString();
    if (sekarang === value) return;
    view.dispatch({ changes: { from: 0, to: sekarang.length, insert: value }, selection: { anchor: 0 } });
  }, [value]);

  return <div ref={wadah} className="h-full min-h-0 overflow-hidden" />;
}
