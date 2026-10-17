import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

export function useLogin() {
    const router = useRouter();
    const { login } = useAuth();

    return useMutation({
        mutationFn: (input: { email: string; password: string }) =>
            login(input.email, input.password),
        onSuccess: (user) => router.push(user.role === "admin" ? "/admin" : "/"),
    });
}

export function useRegister() {
    const router = useRouter();
    const { register } = useAuth();

    return useMutation({
        mutationFn: (input: {
            name: string;
            email: string;
            password: string;
        }) => register(input.name, input.email, input.password),
        onSuccess: () => router.push("/"),
    });
}