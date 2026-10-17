import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { EventItem, EventsPage } from "@/types";

export function useEvents(params: { search: string; page: number }) {
    return useQuery({
        queryKey: ["events", params],
        queryFn: () => api.get<EventsPage>("/api/events", params),
        placeholderData: keepPreviousData,
    });
}

export function useEvent(id: string) {
    return useQuery({
        queryKey: ["event", id],
        queryFn: async () => {
            const data = await api.get<{ event: EventItem }>(
                `/api/events/${encodeURIComponent(id)}`,
            );

            return data.event;
        },
    });
}