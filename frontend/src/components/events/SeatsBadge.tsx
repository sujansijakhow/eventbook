export type SeatTone = "ok" | "low" | "full" | "ended";

export function getSeatState(seatsLeft: number, totalSeats: number) {
    if (seatsLeft <= 0) {
        return { label: "Sold out", tone: "full" as SeatTone };
    }

    if (seatsLeft <= 5 || seatsLeft / totalSeats <= 0.1) {
        return {
            label: `Only ${seatsLeft} left`,
            tone: "low" as SeatTone,
        };
    }

    return {
        label: `${seatsLeft} seats left`,
        tone: "ok" as SeatTone,
    };
}

const styles: Record<SeatTone, string> = {
    ok: "bg-green-100 text-green-800",
    low: "bg-amber-100 text-amber-800",
    full: "bg-red-100 text-red-800",
    ended: "bg-slate-100 text-slate-600",
};

export const seatBarColors: Record<SeatTone, string> = {
    ok: "bg-brand-600",
    low: "bg-amber-500",
    full: "bg-red-600",
    ended: "bg-slate-400",
};

type Props = { label: string; tone: SeatTone };

export function SeatsBadge({ label, tone }: Props) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[tone]}`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {label}
        </span>
    );
}