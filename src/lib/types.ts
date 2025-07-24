import z from "zod/v3"
// Password validation schema
// This schema ensures that the password meets the following criteria:
const passwordField = z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .refine((val) => /[a-z]/.test(val), {
        message: "Password must include at least one lowercase letter",
    })
    .refine((val) => /[A-Z]/.test(val), {
        message: "Password must include at least one uppercase letter",
    })
    .refine((val) => /\d/.test(val), {
        message: "Password must include at least one number",
    })
    .refine((val) => /[@$!%*?&^#()[\]{}\-_=+|\\:;"'<>,./]/.test(val), {
        message: "Password must include at least one special character",
    })


// Register Schema
export const registerSchema = z.object({
    name: z.string(),
    email: z.string().email("enter a valid email address"),
    about: z.string().min(10, "about should be minimi=um of 10 characters").optional(),
    password: passwordField

})

export type RegisterSchemaType = z.infer<typeof registerSchema>


// Login Schema
export const loginSchema = z.object({
    email: z.string().email("enter a valid email address"),
    password: passwordField

})

export type LoginSchemaType = z.infer<typeof loginSchema>


// OTP Schema
// This schema validates the one-time password (OTP) input.
export const otpSchema = z.object({
    otp: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    }),
})
export type OTPSchemaType = z.infer<typeof otpSchema>

//Forgot Password Schema

export const forgetFormSchema = z.object({
    email: z.string().email("enter a valid email address")
})
export type ForgetFormSchemaType = z.infer<typeof forgetFormSchema>


export const resetFormSchema = z.object({
    otp: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    }),
    email: z.string().email("enter a valid email address"),
    new_password: passwordField
})
export type ResetFormSchemaType = z.infer<typeof resetFormSchema>



// API Response Type
// This type is used to standardize the structure of API responses across the application.
export type ApiResponse<T> = {
    success: boolean;
    data: T | null;
    error?: string;
}

// Upload Profile Image Schema
// This schema is used to validate the image file being uploaded for the user's profile.
export type UploadProfileImgSchema = {
    image: File;
}

export interface ChatData {
    chat_id: string;
    receiverId: string;
    receiverName: string;
    latestMessage: string | null;
    latestMessageTime: string | null;
}


export interface ChatListResponse {
    chatListData: ChatData[];
    noData: boolean;
}

export interface StartChatData {
    chat_id: string
    receiverId: string
    receiverName: string
    type: string

}


export interface Message {
    id: string;
    timestamp: Date;
    // chatId: string;
    senderId: string;
    // senderName: string;

    content: string | null;

}


export interface PublicUser {
    id: string;
    username: string;
    name: string;
    about: string | null;
    email: string;
    isVerified: boolean;
    createdAt: Date | null;
    updatedAt: Date | null;
    profileImgUrl: string | null;

}


export type ChatListStreamRes = {
    data: ChatData;
    noData: boolean;
}
export type AuthResponse = ApiResponse<{ userData: PublicUser }>;
