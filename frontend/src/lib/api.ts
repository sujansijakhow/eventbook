import type { FieldError } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN_KEY = "eventbook_token";

if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
}

export class ApiError extends Error {
    status: number;
    details: FieldError[];

    constructor(
        status: number,
        message: string,
        details: FieldError[] = [],
    ) {
        super(message);
        this.status = status;
        this.details = details;
    }
}

export const tokenStore = {
    get: () =>
        typeof window === "undefined"
            ? null
            : localStorage.getItem(TOKEN_KEY),
    set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
    clear: () => localStorage.removeItem(TOKEN_KEY),
};

type Params = Record<string, string | number | undefined>;

async function request<T>(
    method: string,
    path: string,
    options: { body?: unknown; params?: Params } = {},
): Promise<T> {
    const url = new URL(path, BASE_URL);

    for (const [key, value] of Object.entries(options.params ?? {})) {
        if (value !== undefined && value !== "") {
            url.searchParams.set(key, String(value));
        }
    }

    const headers: Record<string, string> = {};
    const token = tokenStore.get();

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    if (options.body !== undefined) {
        headers["Content-Type"] = "application/json";
    }

    let response: Response;

    try {
        response = await fetch(url, {
            method,
            headers,
              cache: "no-store",
            body:
                options.body === undefined
                    ? undefined
                    : JSON.stringify(options.body),
        });
    } catch {
        throw new ApiError(0, "Cannot reach the server. Please try again.");
    }

    if (response.status === 204) {
        return undefined as T;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new ApiError(
            response.status,
            data?.error?.message ?? "Something went wrong",
            data?.error?.details ?? [],
        );
    }

    return data as T;
}

export const api = {
    get: <T>(path: string, params?: Params) =>
        request<T>("GET", path, { params }),
    post: <T>(path: string, body?: unknown) =>
        request<T>("POST", path, { body }),
    put: <T>(path: string, body?: unknown) =>
        request<T>("PUT", path, { body }),
    delete: (path: string) => request<void>("DELETE", path),
};

export function fieldError(error: unknown, field: string) {
    if (!(error instanceof ApiError)) {
        return undefined;
    }

    return error.details.find((detail) => detail.field === field)
        ?.message;
}