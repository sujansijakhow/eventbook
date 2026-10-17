"use client";

import { useState, type FormEvent } from "react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { TextAreaField } from "@/components/ui/TextAreaField";
import { ApiError, fieldError } from "@/lib/api";
import { fromInputValue, toInputValue } from "@/lib/format";
import { validateEvent, type Errors } from "@/lib/validation";
import type { EventInput, EventItem } from "@/types";

type Props = {
    initial?: EventItem;
    submitLabel: string;
    pending: boolean;
    error: Error | null;
    onSubmit: (input: EventInput) => void;
    onCancel: () => void;
};

export function EventForm({
    initial,
    submitLabel,
    pending,
    error,
    onSubmit,
    onCancel,
}: Props) {
    const [title, setTitle] = useState(initial?.title ?? "");
    const [description, setDescription] = useState(initial?.description ?? "");
    const [venue, setVenue] = useState(initial?.venue ?? "");
    const [startsAt, setStartsAt] = useState(
        initial ? toInputValue(initial.startsAt) : "",
    );
    const [totalSeats, setTotalSeats] = useState(
        initial ? String(initial.totalSeats) : "",
    );
    const [errors, setErrors] = useState<Errors>({});

    const hasFieldErrors =
        error instanceof ApiError && error.details.length > 0;

    const nowValue = toInputValue(new Date().toISOString());

    function handleSubmit(event: FormEvent) {
        event.preventDefault();

        const found = validateEvent({
            title,
            description,
            venue,
            startsAt,
            totalSeats,
        });
        setErrors(found);

        if (Object.keys(found).length > 0) {
            return;
        }

        onSubmit({
            title: title.trim(),
            description: description.trim(),
            venue: venue.trim(),
            startsAt: fromInputValue(startsAt),
            totalSeats: Number(totalSeats),
        });
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="mt-4 space-y-4">
            {error && !hasFieldErrors && <Alert>{error.message}</Alert>}

            <FormField
                id="title"
                label="Title"
                placeholder="Intro to Next.js Workshop"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                error={errors.title ?? fieldError(error, "title")}
            />
            <TextAreaField
                id="description"
                label="Description"
                placeholder="What will people do at this event?"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                error={errors.description ?? fieldError(error, "description")}
            />
            <FormField
                id="venue"
                label="Venue"
                placeholder="Northlight Hub, Kathmandu"
                value={venue}
                onChange={(event) => setVenue(event.target.value)}
                error={errors.venue ?? fieldError(error, "venue")}
            />

            <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                    id="startsAt"
                    label="Starts at"
                    type="datetime-local"
                    hint="Nepal time"
                    min={nowValue}
                    value={startsAt}
                    onChange={(event) => setStartsAt(event.target.value)}
                    error={errors.startsAt ?? fieldError(error, "startsAt")}
                />
                <FormField
                    id="totalSeats"
                    label="Total seats"
                    type="number"
                    min={1}
                    placeholder="50"
                    value={totalSeats}
                    onChange={(event) => setTotalSeats(event.target.value)}
                    error={errors.totalSeats ?? fieldError(error, "totalSeats")}
                />
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button
                    variant="secondary"
                    onClick={onCancel}
                    disabled={pending}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={pending}>
                    {pending ? "Saving…" : submitLabel}
                </Button>
            </div>
        </form>
    );
}
