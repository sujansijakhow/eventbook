import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

type Props = {
    open: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    pending?: boolean;
    error?: string;
    onConfirm: () => void;
    onClose: () => void;
};

export function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel,
    pending = false,
    error,
    onConfirm,
    onClose,
}: Props) {
    return (
        <Modal open={open} onClose={onClose} title={title}>
            <p className="mt-2 text-sm text-slate-600">{message}</p>

            {error && (
                <div className="mt-4">
                    <Alert>{error}</Alert>
                </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
                <Button
                    variant="secondary"
                    onClick={onClose}
                    disabled={pending}
                >
                    Go back
                </Button>
                <Button
                    variant="danger"
                    onClick={onConfirm}
                    disabled={pending}
                >
                    {pending ? "Working…" : confirmLabel}
                </Button>
            </div>
        </Modal>
    );
}