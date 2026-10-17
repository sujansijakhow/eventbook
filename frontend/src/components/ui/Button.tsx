import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger";
type Size = "md" | "sm";

const variants: Record<Variant, string> = {
    primary: "border-brand-700 bg-brand-700 text-white hover:bg-brand-800",
    secondary: "border-slate-300 bg-white text-slate-900 hover:bg-slate-50",
    danger: "border-red-200 bg-white text-red-700 hover:bg-red-50",
};

const sizes: Record<Size, string> = {
    md: "px-4 py-2.5 text-sm",
    sm: "px-3 py-1.5 text-[13px]",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md") {
    return `cursor-pointer inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]}`;
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    size?: Size;
};

export function Button({ variant, size, className = "", ...props }: Props) {
    return (
        <button
            type="button"
            className={`${buttonClass(variant, size)} ${className}`}
            {...props}
        />
    );
}
