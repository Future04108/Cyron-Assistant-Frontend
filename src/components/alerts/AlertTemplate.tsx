// @ts-expect-error react-alert ships without TS types in this repo
import type { AlertComponentPropsWithStyle } from 'react-alert';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';
import clsx from 'clsx';

type AlertType = 'success' | 'error' | 'info';

const ICON: Record<AlertType, React.ReactNode> = {
  success: <FaCheckCircle className="h-4 w-4" />,
  error: <FaExclamationTriangle className="h-4 w-4" />,
  info: <FaInfoCircle className="h-4 w-4" />,
};

const SURFACE: Record<AlertType, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  error: 'border-red-200 bg-red-50 text-red-900',
  info: 'border-sky-200 bg-sky-50 text-sky-900',
};

const ICON_COLOR: Record<AlertType, string> = {
  success: 'text-emerald-600',
  error: 'text-red-600',
  info: 'text-sky-600',
};

export function AlertTemplate({
  style,
  options,
  message,
  close,
}: AlertComponentPropsWithStyle) {
  const type = (options.type ?? 'info') as AlertType;

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={clsx(
        'pointer-events-auto w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl border px-4 py-3 shadow-lg',
        'backdrop-blur supports-[backdrop-filter]:bg-opacity-90',
        SURFACE[type],
      )}
      style={style}
    >
      <div className="flex items-start gap-3">
        <div className={clsx('mt-0.5 shrink-0', ICON_COLOR[type])}>{ICON[type]}</div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold leading-5">{message}</div>
        </div>
        <button
          type="button"
          onClick={close}
          className={clsx(
            'ml-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
            'transition hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2',
            type === 'error'
              ? 'focus:ring-red-300 focus:ring-offset-red-50'
              : type === 'success'
                ? 'focus:ring-emerald-300 focus:ring-offset-emerald-50'
                : 'focus:ring-sky-300 focus:ring-offset-sky-50',
          )}
          aria-label="Dismiss alert"
        >
          <FaTimes className="h-3.5 w-3.5 opacity-70" />
        </button>
      </div>
    </div>
  );
}

