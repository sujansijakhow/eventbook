import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { Booking } from "@/types";

export function useMyBookings(enabled = true) {
    return useQuery({
        queryKey: ["bookings"],
        queryFn: async () => {
            const data = await api.get<{ bookings: Booking[] }>(
                "/api/bookings/me",
            );

            return data.bookings;
        },
        enabled,
    });
}

export function useBookEvent(eventId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => api.post("/api/bookings", { eventId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["event", eventId] });
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
        },
    });
}

export function useCancelBooking() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (bookingId: string) =>
            api.delete(`/api/bookings/${bookingId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bookings"] });
            queryClient.invalidateQueries({ queryKey: ["event"] });
            queryClient.invalidateQueries({ queryKey: ["events"] });
        },
    });
}