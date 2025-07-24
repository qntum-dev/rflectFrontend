"use client"

import { forgetFormSchema, ForgetFormSchemaType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { sendForgetPasswordOTP } from "../actions/auth-actions";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResetForm from "./reset-form";

const ForgetForm = () => {
    const [isPending, startTransition] = useTransition();
    const [resetForm, setResetForm] = useState(false);
    const [submittedEmail, setSubmittedEmail] = useState<string | null>(null); // ✅ holds the submitted email

    const form = useForm<ForgetFormSchemaType>({
        resolver: zodResolver(forgetFormSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = async (values: ForgetFormSchemaType) => {
        startTransition(async () => {
            const result = await sendForgetPasswordOTP(values);

            if (result.error) {
                form.setError("root", {
                    message: result.error,
                });
            } else {
                const status = result.data?.status;
                if (status) {
                    setSubmittedEmail(values.email); // ✅ store email
                    setResetForm(true); // ✅ show ResetForm
                } else {
                    form.setError("root", {
                        message: "Failed to send otp: Invalid server response",
                    });
                }
            }
        });
    };

    if (resetForm && submittedEmail) {
        return (
            <div className="w-full h-screen flex justify-center items-center bg-gray-950">
                <ResetForm email={submittedEmail} /> {/* ✅ pass email */}
            </div>
        );
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
                                        autoComplete="email"
                                        disabled={isPending}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition disabled:opacity-50"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending OTP...
                            </>
                        ) : (
                            "Send OTP"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default ForgetForm;
