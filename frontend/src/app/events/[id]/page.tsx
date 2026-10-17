import { Suspense } from "react";

import { EventDetail } from "@/components/events/EventDetail";
import { Spinner } from "@/components/ui/Spinner";

export default function EventPage() {
    return (
        <Suspense fallback={<Spinner label="Loading event…" />}>
            <EventDetail />
        </Suspense>
    );
}