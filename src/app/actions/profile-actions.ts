"use server";

import { apiHandler } from "@/lib/api-handler";

export const uploadProfileImg = async (formData: FormData) => {
    const file = formData.get("file") as File;
    if (!file) {
        return { success: false, error: "No file provided" };
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString("base64");

    const res = await apiHandler<{ base64: string }, { url: string }>(
        "/media/uploadProfileImage",
        { base64: base64String },
        "post"
    );

    if (!res.success || !res.data) {
        return { success: false, error: res.error || "Upload failed." };
    }

    // Optional: revalidate user data here
    // revalidatePath("/settings"); 

    return { success: true, data: res.data };
};
