import Link from "next/link";

import { buttonClass } from "@/components/ui/Button";

export default function NotFound() {
    return (
        <div className="py-16 text-center">
            <h1 className="text-3xl font-bold">Page not found</h1>
            <p className="mt-2 text-slate-600">
                The page you are looking for does not exist.
            </p>
            <Link
                href="/"
                className={`${buttonClass("primary")} mt-6`}
            >
                Back to events
            </Link>
        </div>
    );
}