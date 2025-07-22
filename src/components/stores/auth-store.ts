"use client";

import { PublicUser } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";


interface AuthState {
    user: PublicUser | null;
    login: (payload: { user: PublicUser }) => void;
    logout: () => void;
    updateUser: (updatedFields: Partial<PublicUser>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            login: ({ user }) => set({ user }),
            logout: () => set({ user: null }),
            updateUser: (updatedFields: Partial<PublicUser>) => {
                const currentUser = get().user;
                if (currentUser) {
                    set({ user: { ...currentUser, ...updatedFields } });
                }
            },

        }),
        {
            name: "auth-storage", // localStorage key
        }
    )
);
