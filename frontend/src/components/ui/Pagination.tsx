import Link from "next/link";

import { buttonClass } from "@/components/ui/Button";

type Props = {
    page: number;
    totalPages: number;
    hrefFor: (page: number) => string;
};

const disabled = "pointer-events-none opacity-50";

export function Pagination({ page, totalPages, hrefFor }: Props) {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <nav
            aria-label="Pagination"
            className="mt-8 flex items-center justify-center gap-4"
        >
            {page > 1 ? (
                <Link
                    href={hrefFor(page - 1)}
                    className={buttonClass("secondary")}
                >
                    Previous
                </Link>
            ) : (
                <span
                    aria-disabled="true"
                    className={`${buttonClass("secondary")} ${disabled}`}
                >
                    Previous
                </span>
            )}

            <span className="text-sm text-slate-500">
                Page {page} of {totalPages}
            </span>

            {page < totalPages ? (
                <Link
                    href={hrefFor(page + 1)}
                    className={buttonClass("secondary")}
                >
                    Next
                </Link>
            ) : (
                <span
                    aria-disabled="true"
                    className={`${buttonClass("secondary")} ${disabled}`}
                >
                    Next
                </span>
            )}
        </nav>
    );
}