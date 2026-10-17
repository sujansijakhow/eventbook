import { Suspense } from "react";

import { EventResults } from "@/components/events/EventResults";
import { EventSearch } from "@/components/events/EventSearch";
import { EventsHero } from "@/components/events/EventsHero";
import { Spinner } from "@/components/ui/Spinner";

export default function HomePage() {
    return (
        <div>
            <div className="flex flex-wrap items-end justify-between gap-6">
                <EventsHero />
                <Suspense fallback={null}>
                    <EventSearch />
                </Suspense>
            </div>

            <Suspense fallback={<Spinner label="Loading events…" />}>
                <EventResults />
            </Suspense>
        </div>
    );
}