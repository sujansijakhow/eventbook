import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { EventInput, EventItem, Stats } from "@/types";

function useRefreshEvents() {
    const queryClient = useQueryClient();

    return () => {
        queryClient.invalidateQueries({ queryKey: ["events"] });
        queryClient.invalidateQueries({ queryKey: ["event"] });
        queryClient.invalidateQueries({ queryKey: ["stats"] });
    };
}

export function useStats() {
    return useQuery({
        queryKey: ["stats"],
        queryFn: async () => {
            const data = await api.get<{ stats: Stats }>(
                "/api/events/stats",
            );

            return data.stats;
        },
    });
}

export function useCreateEvent() {
    const refresh = useRefreshEvents();

    return useMutation({
        mutationFn: (input: EventInput) =>
            api.post<{ event: EventItem }>("/api/events", input),
        onSuccess: refresh,
    });
}

export function useUpdateEvent() {
    const refresh = useRefreshEvents();

    return useMutation({
        mutationFn: (args: { id: string; input: EventInput }) =>
            api.put<{ event: EventItem }>(
                `/api/events/${args.id}`,
                args.input,
            ),
        onSuccess: refresh,
    });
}

export function useDeleteEvent() {
    const refresh = useRefreshEvents();

    return useMutation({
        mutationFn: (id: string) => api.delete(`/api/events/${id}`),
        onSuccess: refresh,
    });
}