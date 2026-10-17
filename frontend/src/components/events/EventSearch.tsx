"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useDebounce } from "@/hooks/useDebounce";

type Props = {
    basePath?: string;
};

export function EventSearch({ basePath = "/" }: Props) {
    const router = useRouter();
    const current = useSearchParams().get("search") ?? "";
    const [value, setValue] = useState(current);
    const debounced = useDebounce(value.trim());

    useEffect(() => {
        if (debounced === current) {
            return;
        }

        router.replace(
            debounced
                ? `${basePath}?search=${encodeURIComponent(debounced)}`
                : basePath,
        );
    }, [debounced, current, router, basePath]);

    return (
        <div className="w-full max-w-sm min-w-64 flex-1">
            <label
                htmlFor="search"
                className="mb-1.5 block text-sm font-medium"
            >
                Search events
            </label>
            <div className="relative">
                <Search
                    size={16}
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                />
                <input
                    id="search"
                    type="search"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    placeholder="Search by title"
                    className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pr-3 pl-9 text-sm focus:outline-2 focus:outline-brand-600"
                />
            </div>
        </div>
    );
}