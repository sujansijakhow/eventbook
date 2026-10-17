"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";

type Props = {
    open: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
};

export function Modal({ open, onClose, title, children }: Props) {
    const ref = useRef<HTMLDialogElement>(null);
    const titleId = useId();

    useEffect(() => {
        const dialog = ref.current;

        if (!dialog) {
            return;
        }

        if (open && !dialog.open) {
            dialog.showModal();
        } else if (!open && dialog.open) {
            dialog.close();
        }
    }, [open]);

    return (
        <dialog
            ref={ref}
            aria-labelledby={titleId}
            onClose={onClose}
            onClick={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
            className="m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-md overflow-y-auto rounded-xl bg-white p-0 shadow-xl backdrop:bg-slate-900/60"
        >
            <div className="p-6">
                <h2 id={titleId} className="text-xl font-bold">
                    {title}
                </h2>
                {children}
            </div>
        </dialog>
    );
}