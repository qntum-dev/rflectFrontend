"use server"

import { apiHandler } from "@/lib/api-handler";
import { ApiResponse, AuthResponse, PublicUser } from "@/lib/types"
import { LoginSchemaType, OTPSchemaType, RegisterSchemaType } from "@/lib/types";

// interface SuccessResponse {
//     message: string
// }


export const registerAction = async (data: RegisterSchemaType): Promise<AuthResponse> => {

    console.log("Form submitted:", data)

    const response = await apiHandler<RegisterSchemaType, { userData: PublicUser }>(
        "/user/create",
        data,
        "post"
    );
    return {
        success: response.success,
        data: response.data,
        error: response.error
    };

}

// export const loginAction = async (data: LoginSchemaType): Promise<AuthResponse> => {

//     console.log("Form submitted:", data)

//     const response = await apiHandler<LoginSchemaType, { userData: PublicUser }>(
//         "/user/login",
//         data,
//         "post"
//     );
//     return {
//         success: response.success,
//         data: response.data,
//         error: response.error
//     };

// }

export const loginAction = async (data: LoginSchemaType): Promise<AuthResponse> => {

    console.log("Form submitted:", data)

    const response = await apiHandler<LoginSchemaType, { userData: PublicUser }>(
        "/user/loginRaw",
        data,
        "post"
    );
    return {
        success: response.success,
        data: response.data,
        error: response.error
    };

}
type sendOTPStatus = ApiResponse<{ status: string }>

export const sendACVerification = async (): Promise<sendOTPStatus> => {

    const { success, data, error } = await apiHandler<unknown, { status: string }>("/otp/sendVerifyOTP")

    return {
        success,
        data,
        error
    }
}

export const VerifyOTP = async (otpData: OTPSchemaType): Promise<sendOTPStatus> => {

    const { success, data, error } = await apiHandler<OTPSchemaType, { status: string }>("/otp/verify-email", otpData, "post")

    return {
        success,
        data,
        error
    }
}