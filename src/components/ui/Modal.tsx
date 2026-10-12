"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { IconClose } from "./icons";

interface ModalProps {
  open: boolean;
  title: ReactNode;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  /** Visual style of the dialog body. */
  tone?: "panel" | "paper";
  hideClose?: boolean;
}

const SIZES = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-3xl", xl: "max-w-5xl" };

/** Accessible modal dialog: Escape closes, focus moves in and is restored. */
export function Modal({ open, title, onClose, children, footer, size = "md", tone = "panel", hideClose }: ModalProps) {
  const titleId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const node = ref.current;
    const focusable = () =>
      Array.from(node?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') ?? []).filter((el) => !el.hasAttribute("disabled"));
    (focusable()[0] ?? node)?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCloseRef.current();
      } else if (e.key === "Tab") {
        const els = focusable();
        if (els.length === 0) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-2 backdrop-blur-[2px] sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`fade-in flex max-h-[92dvh] w-full ${SIZES[size]} flex-col overflow-hidden rounded-xl ${tone === "paper" ? "paper" : "panel"}`}
      >
        <div className={`flex items-center justify-between gap-3 border-b px-4 py-3 ${tone === "paper" ? "border-black/15" : "border-brass/20"}`}>
          <h2 id={titleId} className={`font-display text-lg ${tone === "paper" ? "text-[#2a2018]" : "text-brass-2"}`}>
            {title}
          </h2>
          {!hideClose && (
            <button type="button" onClick={onClose} className={`rounded-md p-1.5 ${tone === "paper" ? "text-[#2a2018] hover:bg-black/10" : "text-cream hover:bg-white/10"}`} aria-label="Close">
              <IconClose />
            </button>
          )}
        </div>
        <div className="scrollbar-thin flex-1 overflow-y-auto px-4 py-4">{children}</div>
        {footer && <div className={`flex flex-wrap justify-end gap-2 border-t px-4 py-3 ${tone === "paper" ? "border-black/15" : "border-brass/20"}`}>{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  danger,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      size="sm"
      footer={
        <>
          <button type="button" className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className={`btn ${danger ? "btn-danger" : "btn-primary"}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="text-sm leading-relaxed text-cream/90">{message}</div>
    </Modal>
  );
}
