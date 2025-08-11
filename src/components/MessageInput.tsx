import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  onSend: (text: string) => void;
  onAttach?: (file: File) => void;          // optional
  onTyping?: (isTyping: boolean) => void;   // optional
  quickReplies?: string[];                  // optional pills
  placeholder?: string;
  maxLength?: number;                       // optional counter
  disabled?: boolean;
};

function classNames(...xs: Array<string | false | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export default function MessageInput({
  onSend,
  onAttach,
  onTyping,
  quickReplies = [],
  placeholder = "Type a message…",
  maxLength,
  disabled = false,
}: Props) {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const canSend = useMemo(() => text.trim().length > 0 && !disabled, [text, disabled]);

  // Auto-grow textarea
  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "0px";
    const next = Math.min(el.scrollHeight, 240); // cap height
    el.style.height = next + "px";
  }, [text]);

  // Typing debounce (fires true immediately, false after 1.2s idle)
  useEffect(() => {
    if (!onTyping) return;
    if (!text) {
      if (isTyping) {
        setIsTyping(false);
        onTyping(false);
      }
      return;
    }
    if (!isTyping) {
      setIsTyping(true);
      onTyping(true);
    }
    const t = setTimeout(() => {
      setIsTyping(false);
      onTyping(false);
    }, 1200);
    return () => clearTimeout(t);
  }, [text, isTyping, onTyping]);

  const send = () => {
    const t = text.trim();
    if (!t || disabled) return;
    onSend(t);
    setText("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const pickFile = () => fileRef.current?.click();
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    onAttach?.(f);
    // reset
    e.target.value = "";
  };

  const addQuickReply = (q: string) => {
    setText((prev) => (prev ? prev + " " + q : q));
    taRef.current?.focus();
  };

  const leftCount =
    typeof maxLength === "number" ? Math.max(0, maxLength - text.length) : undefined;

  return (
    <div className="border-t bg-white">
      {/* Quick replies (optional) */}
      {quickReplies.length > 0 && (
        <div className="px-3 pt-2 flex gap-2 overflow-x-auto no-scrollbar">
          {quickReplies.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => addQuickReply(q)}
              className="shrink-0 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-1 text-xs text-slate-700"
              title={q}
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="p-3">
        <div
          className={classNames(
            "flex items-end gap-2 rounded-2xl border px-2 py-2",
            "bg-slate-50 focus-within:bg-white border-slate-200 focus-within:ring-2 focus-within:ring-indigo-200"
          )}
        >
          {/* Attach */}
          <button
            type="button"
            onClick={pickFile}
            className="hidden sm:inline-flex items-center justify-center h-10 w-10 rounded-xl border border-transparent hover:bg-slate-100 text-slate-600"
            title="Attach file"
            disabled={disabled}
          >
            📎
          </button>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            onChange={onFile}
            aria-hidden
          />

          {/* Textarea */}
          <textarea
            ref={taRef}
            value={text}
            onChange={(e) => {
              if (typeof maxLength === "number" && e.target.value.length > maxLength) return;
              setText(e.target.value);
            }}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={classNames(
              "flex-1 resize-none bg-transparent outline-none",
              "text-[15px] leading-snug min-h-[40px] max-h-[240px] placeholder:text-slate-400"
            )}
          />

          {/* Counter (optional) */}
          {typeof leftCount === "number" && (
            <div className="hidden md:block text-[11px] text-slate-400 px-1 select-none">
              {leftCount}
            </div>
          )}

          {/* Send */}
          <button
            type="button"
            onClick={send}
            disabled={!canSend}
            className={classNames(
              "inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium transition",
              canSend
                ? "bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95"
                : "bg-slate-200 text-slate-500 cursor-not-allowed"
            )}
          >
            Send ↵
          </button>
        </div>

        {/* Mobile attach button */}
        <div className="mt-2 sm:hidden">
          <button
            type="button"
            onClick={pickFile}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
            disabled={disabled}
          >
            Attach file
          </button>
        </div>
      </div>
    </div>
  );
}
