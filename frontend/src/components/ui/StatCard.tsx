type Props = {
    label: string;
    value?: string | number;
    hint: string;
};

export function StatCard({ label, value, hint }: Props) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-1.5 text-3xl font-bold">{value ?? "—"}</p>
            <p className="mt-1 text-[13px] text-slate-500">{hint}</p>
        </div>
    );
}