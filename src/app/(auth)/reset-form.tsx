"use client"
import { resetFormSchema, ResetFormSchemaType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { verifyForgotPassword } from "../actions/auth-actions";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";




const ResetForm = ({ email }: { email: string }) => {
    const [isPending, startTransition] = useTransition();
    const [errMSG, setErrMSG] = useState<string | undefined>();
    const [showPassword, setShowPassword] = useState(false)

    const router = useRouter();
    const form = useForm<ResetFormSchemaType>({
        resolver: zodResolver(resetFormSchema),
        defaultValues: {
            email,
            otp: "",
            new_password: ""
        },
    })

    const onSubmit = async (values: ResetFormSchemaType) => {
        startTransition(async () => {
            const result = await verifyForgotPassword(values)

            if (result.error) {
                form.setError("root", {
                    message: result.error,
                })
                return setErrMSG(result.error)

            } else {
                const status = result.data?.status
                if (status) {
                    router.push("/login")
                } else {
                    form.setError("root", {
                        message: "Failed to verify otp: Invalid server response",
                    })
                }
            }
        })
    }
    return (
        <div className="w-full h-screen flex justify-center items-center bg-gray-950">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-6 p-6 w-full max-w-sm rounded-lg shadow-md bg-gray-900 text-gray-100"
                >
                    <h2 className="text-2xl font-semibold text-center">
                        Send Reset OTP
                    </h2>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your email"
                                        {...field}
                                        required
                                        value={email}
                                        // defaultValue={email}
                                        autoComplete="email"
                                        disabled={true}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="new_password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            placeholder="Enter New password"
                                            {...field}
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            disabled={isPending}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
                                            disabled={isPending}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        disabled={isPending}
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>OTP</FormLabel>
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
                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition disabled:opacity-50"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Setting New Password...
                            </>
                        ) : (
                            "Set New Password"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default ResetForm;