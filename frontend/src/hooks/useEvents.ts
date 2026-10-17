import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { EventsPage } from "@/types";

export function useEvents(params: { search: string; page: number }) {
    return useQuery({
        queryKey: ["events", params],
        queryFn: () => api.get<EventsPage>("/api/events", params),
        placeholderData: keepPreviousData,
    });
}