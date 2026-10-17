import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    id: string;
    error?: string;
    hint?: string;
};

export function FormField({
    label,
    id,
    error,
    hint,
    className = "",
    ...props
}: Props) {
    return (
        <div>
            <label
                htmlFor={id}
                className="mb-1.5 block text-sm font-medium"
            >
                {label}
            </label>
            <input
                id={id}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm focus:outline-2 focus:outline-brand-600 ${
                    error ? "border-red-500" : "border-slate-300"
                } ${className}`}
                {...props}
            />
            {error ? (
                <p
                    id={`${id}-error`}
                    className="mt-1.5 text-[13px] text-red-700"
                >
                    {error}
                </p>
            ) : (
                hint && (
                    <p className="mt-1.5 text-[13px] text-slate-500">
                        {hint}
                    </p>
                )
            )}
        </div>
    );
}