const TIME_ZONE = "Asia/Kathmandu";

export function formatDateTime(iso: string) {
    const date = new Date(iso);
    const day = date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        timeZone: TIME_ZONE,
    });
    const time = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: TIME_ZONE,
    });

    return `${day} · ${time}`;
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