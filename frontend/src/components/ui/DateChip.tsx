type Props = { month: string; day: string };

export function DateChip({ month, day }: Props) {
    return (
        <div className="w-12 shrink-0 overflow-hidden rounded-[10px] border border-slate-200 bg-white text-center">
            <div className="bg-brand-700 py-0.5 text-[10px] font-bold tracking-wider text-white">
                {month}
            </div>
            <div className="py-1 text-xl font-bold">{day}</div>
        </div>
    );
}