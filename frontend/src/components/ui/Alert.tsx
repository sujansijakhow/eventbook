import type { ReactNode } from "react";

type Props = {
    variant?: "error" | "success";
    children: ReactNode;
};

const styles = {
    error: "border-red-200 bg-red-50 text-red-800",
    success: "border-green-200 bg-green-50 text-green-800",
};

export function Alert({ variant = "error", children }: Props) {
    return (
        <div
            role={variant === "error" ? "alert" : "status"}
            className={`rounded-lg border px-3 py-2.5 text-sm ${styles[variant]}`}
        >
            {children}
        </div>
    );
}