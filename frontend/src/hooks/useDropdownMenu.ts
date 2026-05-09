"use client";
import * as React from "react";

export type BulkMenuController = {
  open: boolean;
  toggle: () => void;
  close: () => void;
   ref: React.MutableRefObject<HTMLDivElement | null>;
};

export default function useBulkActionsMenu(): BulkMenuController {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  const toggle = () => setOpen(o => !o);
  const close = () => setOpen(false);

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (open && ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return { open, toggle, close, ref };
}
