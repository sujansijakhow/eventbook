import type { TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
    label: string;
    id: string;
    error?: string;
};

export function TextAreaField({
    label,
    id,
    error,
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
            <textarea
                id={id}
                rows={4}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm focus:outline-2 focus:outline-brand-600 ${
                    error ? "border-red-500" : "border-slate-300"
                } ${className}`}
                {...props}
            />
            {error && (
                <p
                    id={`${id}-error`}
                    className="mt-1.5 text-[13px] text-red-700"
                >
                    {error}
                </p>
            )}
        </div>
    );
}