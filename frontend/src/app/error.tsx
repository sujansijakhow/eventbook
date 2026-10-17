"use client";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";

export default function ErrorPage({ reset }: { reset: () => void }) {
    return (
        <div className="mx-auto max-w-md space-y-3 py-12">
            <Alert>
                We couldn&apos;t load this page. The server may be waking
                up, so please try again in a moment.
            </Alert>
            <Button variant="secondary" onClick={reset}>
                Try again
            </Button>
        </div>
    );
}   