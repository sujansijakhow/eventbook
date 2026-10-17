import { Eye, EyeOff } from "lucide-react";
import { useState, type InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
    id: string;
    error?: string;
    hint?: string;
    showPasswordToggle?: boolean;
};

export function FormField({
    label,
    id,
    error,
    hint,
    showPasswordToggle = false,
    className = "",
    type,
    ...props
}: Props) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <div>
            <label
                htmlFor={id}
                className="mb-1.5 block text-sm font-medium"
            >
                {label}
            </label>
            <div className={showPasswordToggle ? "relative" : undefined}>
                <input
                    id={id}
                    type={
                        showPasswordToggle
                            ? isPasswordVisible
                                ? "text"
                                : "password"
                            : type
                    }
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? `${id}-error` : undefined}
                    className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm focus:outline-2 focus:outline-brand-600 ${
                        error ? "border-red-500" : "border-slate-300"
                    } ${showPasswordToggle ? "pr-10" : ""} ${className}`}
                    {...props}
                />
                {showPasswordToggle && (
                    <button
                        type="button"
                        aria-label={
                            isPasswordVisible ? "Hide password" : "Show password"
                        }
                        aria-pressed={isPasswordVisible}
                        title={isPasswordVisible ? "Hide password" : "Show password"}
                        onClick={() => setIsPasswordVisible((visible) => !visible)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-slate-500 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-brand-700"
                    >
                        {isPasswordVisible ? (
                            <EyeOff aria-hidden="true" size={18} />
                        ) : (
                            <Eye aria-hidden="true" size={18} />
                        )}
                    </button>
                )}
            </div>
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