"use server"

import { apiHandler } from "@/lib/api-handler";
import { PublicUser } from "@/lib/types";

export const getCurrentUser = async (): Promise<PublicUser | null> => { // Replace with your actual fetching logic
    const response = await apiHandler<undefined, PublicUser>("/getCurrentUser");
    return response.data;
}
