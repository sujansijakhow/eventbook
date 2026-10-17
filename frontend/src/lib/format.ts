const TIME_ZONE = "Asia/Kathmandu";

export function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: TIME_ZONE,
    });
}

export function formatLongDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: TIME_ZONE,
    });
}

export function formatDateTime(iso: string) {
    const day = new Date(iso).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        timeZone: TIME_ZONE,
    });

    return `${day} · ${formatTime(iso)}`;
}

export function dateChipParts(iso: string) {
    const date = new Date(iso);

    return {
        month: date
            .toLocaleDateString("en-US", {
                month: "short",
                timeZone: TIME_ZONE,
            })
            .toUpperCase(),
        day: date.toLocaleDateString("en-US", {
            day: "numeric",
            timeZone: TIME_ZONE,
        }),
    };
}