const UNIQUE_VIOLATION = "23505";

type PgError = {
    code?: string;
    cause?: { code?: string };
};

export function isUniqueViolation(error: unknown): boolean {
    const e = error as PgError | null;

    return (
        e?.code === UNIQUE_VIOLATION ||
        e?.cause?.code === UNIQUE_VIOLATION
    );
}