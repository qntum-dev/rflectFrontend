"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState, useTransition } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { loginAction } from "../actions/auth-actions"
import { useRouter } from "next/navigation"
import { loginSchema, LoginSchemaType } from "@/lib/types"
import { useAuthStore } from "@/components/stores/auth-store"

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [isPending, startTransition] = useTransition()
    const login = useAuthStore((state) => state.login)
    const router = useRouter()

    const form = useForm<LoginSchemaType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (values: LoginSchemaType) => {
        startTransition(async () => {
            const result = await loginAction(values)

            if (result.error) {
                form.setError("root", {
                    message: result.error,
                })
            } else {
                const user = result.data?.userData
                if (user) {
                    login({ user })
                    router.push("/chat")
                } else {
                    form.setError("root", {
                        message: "Login failed: Invalid server response",
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
                        Log in to Your Account
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

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            placeholder="Enter your password"
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

                    {form.formState.errors.root && (
                        <div className="text-red-400 text-sm text-center">
                            {form.formState.errors.root.message}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition disabled:opacity-50"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Logging in...
                            </>
                        ) : (
                            "Log in"
                        )}
                    </Button>

                    <hr className="border-t border-gray-700 w-full" />
                    <div className="text-center text-sm text-gray-300">
                        Don&apos;t have an account?{" "}
                        <a
                            href="/register"
                            className="text-blue-400 hover:text-blue-300 font-medium"
                            tabIndex={isPending ? -1 : 0}
                        >
                            Sign Up
                        </a>
                    </div>
                </form>
            </Form>
        </div>
    )
}
