type Props = {
    value: number;
    max: number;
    barClassName?: string;
};

export function ProgressBar({
    value,
    max,
    barClassName = "bg-brand-600",
}: Props) {
    const percent =
        max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100));

    return (
        <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={max}
            aria-valuenow={value}
            className="h-1.5 overflow-hidden rounded-full bg-slate-200"
        >
            <div
                className={`h-full rounded-full ${barClassName}`}
                style={{ width: `${percent}%` }}
            />
        </div>
    );
}