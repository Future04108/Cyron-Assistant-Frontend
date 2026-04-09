import { useCallback, useEffect, useRef } from 'react';

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

/** Browser contenteditable + toolbar (no extra deps). Output is HTML for storage/API. */
export const RichTextEditor = ({
  value,
  onChange,
  placeholder = 'Content',
  className = '',
  disabled = false,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const sync = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    onChange(el.innerHTML);
  }, [onChange]);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return;
    if (value && el.innerHTML !== value) {
      el.innerHTML = value;
    }
    if (!value && !el.innerHTML) {
      el.innerHTML = '';
    }
  }, [value, disabled]);

  const run = (cmd: string, arg?: string) => {
    if (disabled) return;
    ref.current?.focus();
    try {
      document.execCommand(cmd, false, arg);
    } catch {
      /* ignore */
    }
    sync();
  };

  const btn =
    'rounded px-2 py-1 text-[11px] font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white disabled:opacity-40';

  return (
    <div className={`rounded-lg border border-zinc-700 bg-zinc-950/80 ${className}`}>
      <div className="flex flex-wrap gap-0.5 border-b border-zinc-700 px-1 py-1">
        <button type="button" className={btn} onClick={() => run('formatBlock', 'H2')} title="Heading">
          H
        </button>
        <button type="button" className={btn} onClick={() => run('bold')} title="Bold">
          B
        </button>
        <button type="button" className={btn} onClick={() => run('italic')} title="Italic">
          I
        </button>
        <button type="button" className={btn} onClick={() => run('strikeThrough')} title="Strikethrough">
          S
        </button>
        <button type="button" className={btn} onClick={() => run('insertHorizontalRule')} title="HR">
          —
        </button>
        <button type="button" className={btn} onClick={() => run('formatBlock', 'blockquote')} title="Quote">
          “
        </button>
        <button type="button" className={btn} onClick={() => run('insertUnorderedList')} title="Bullets">
          •
        </button>
        <button type="button" className={btn} onClick={() => run('insertOrderedList')} title="Numbered">
          1.
        </button>
        <button type="button" className={btn} onClick={() => run('outdent')} title="Outdent">
          «
        </button>
        <button type="button" className={btn} onClick={() => run('indent')} title="Indent">
          »
        </button>
        <button type="button" className={btn} onClick={() => run('insertHTML', '<table><tr><td></td><td></td></tr></table>')} title="Table">
          ⧉
        </button>
        <button
          type="button"
          className={btn}
          onClick={() => {
            const u = window.prompt('Link URL');
            if (u) run('createLink', u);
          }}
          title="Link"
        >
          🔗
        </button>
        <button type="button" className={btn} onClick={() => run('formatBlock', 'pre')} title="Code">
          &lt;/&gt;
        </button>
      </div>
      <div
        ref={ref}
        className="min-h-[220px] w-full px-3 py-2 text-sm text-zinc-100 outline-none prose-invert"
        contentEditable={!disabled}
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={sync}
        style={{ whiteSpace: 'pre-wrap' }}
      />
      <style>{`
        [contenteditable][data-placeholder]:empty:before {
          content: attr(data-placeholder);
          color: #71717a;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export function htmlToPlainText(html: string): string {
  const d = document.createElement('div');
  d.innerHTML = html;
  return (d.innerText || d.textContent || '').trim();
}
