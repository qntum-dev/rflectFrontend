"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { otpSchema, OTPSchemaType } from "@/lib/types";
import { VerifyOTP } from "../actions/auth-actions";
import { useAuthStore } from "@/components/stores/auth-store";

export default function VerifyOTPForm() {

    const [isPending, startTransition] = useTransition();
    const updateUser = useAuthStore((state) => state.updateUser);
    const [errMSG, setErrMSG] = useState<string | undefined>();
    const form = useForm<OTPSchemaType>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: "",
        },
    })
    const router = useRouter(); // Use router for navigation

    function onSubmit(data: OTPSchemaType) {
        startTransition(async () => {
            const res = await VerifyOTP(data);
            if (res.error) {
                return setErrMSG(res.error)
            }
            console.log(data);
            updateUser({ isVerified: true }); // Update user state to verified
            console.log("routing to profile");

            router.push("/profile"); // Use router.push instead of redirect
        })

    }
    return (
        <div className="h-dvh flex items-center justify-center bg-gray-950 w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 border border-black p-4 rounded-md bg-gray-900">
                    <h1 className="text-xl font-bold">Verify your account</h1>
                    <FormField
                        disabled={isPending}
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>One-Time Password</FormLabel>
                                <FormControl>
                                    <InputOTP maxLength={6} {...field}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormDescription>
                                    Please enter the one-time password sent to your email address.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {errMSG && <>
                        <p className="text-red-600">{errMSG}</p>
                    </>}
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-500 cursor-pointer text-white"
                        disabled={isPending}
                    >{
                            isPending ? <>

                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting OTP
                            </>
                                : "Submit OTP"
                        }</Button>
                </form>
            </Form>
        </div>
    );
}

