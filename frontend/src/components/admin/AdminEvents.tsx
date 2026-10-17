"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { AdminEventResults } from "@/components/admin/AdminEventResults";
import { EventForm } from "@/components/events/EventForm";
import { EventSearch } from "@/components/events/EventSearch";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import {
    useCreateEvent,
    useDeleteEvent,
    useUpdateEvent,
} from "@/hooks/useAdminEvents";
import type { EventInput, EventItem } from "@/types";

export function AdminEvents() {
    const create = useCreateEvent();
    const update = useUpdateEvent();
    const remove = useDeleteEvent();

    const [editing, setEditing] = useState<EventItem | "new" | null>(null);
    const [deleting, setDeleting] = useState<EventItem | null>(null);

    const saving = editing === "new" ? create : update;

    function closeForm() {
        setEditing(null);
        create.reset();
        update.reset();
    }

    function closeDelete() {
        setDeleting(null);
        remove.reset();
    }

    function handleSubmit(input: EventInput) {
        if (editing === "new") {
            create.mutate(input, { onSuccess: closeForm });
        } else if (editing) {
            update.mutate({ id: editing.id, input }, { onSuccess: closeForm });
        }
    }

    function handleDelete() {
        if (deleting) {
            remove.mutate(deleting.id, { onSuccess: closeDelete });
        }
    }

    return (
        <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-3xl font-bold">Events</h1>
                    <p className="mt-1.5 text-sm text-slate-500">
                        Create, edit and delete events.
                    </p>
                </div>
                <Button onClick={() => setEditing("new")}>
                    <Plus size={16} aria-hidden />
                    New event
                </Button>
            </div>

            <EventSearch basePath="/admin/events" />

            <AdminEventResults onEdit={setEditing} onDelete={setDeleting} />

            <Modal
                open={editing !== null}
                onClose={closeForm}
                title={editing === "new" ? "New event" : "Edit event"}
            >
                {editing && (
                    <EventForm
                        key={editing === "new" ? "new" : editing.id}
                        initial={editing === "new" ? undefined : editing}
                        submitLabel={
                            editing === "new" ? "Create event" : "Save changes"
                        }
                        pending={saving.isPending}
                        error={saving.error}
                        onSubmit={handleSubmit}
                        onCancel={closeForm}
                    />
                )}
            </Modal>

            <ConfirmDialog
                open={deleting !== null}
                title="Delete this event?"
                message={`"${deleting?.title ?? ""}" will be permanently deleted. Events that have bookings can't be deleted.`}
                confirmLabel="Delete event"
                pending={remove.isPending}
                error={remove.error?.message}
                onConfirm={handleDelete}
                onClose={closeDelete}
            />
        </div>
    );
}