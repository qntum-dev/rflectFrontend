"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Loader2, MessageSquareDiff } from "lucide-react"
import z from "zod"
import { useChatUserStore, useCurrentChatStore } from "../stores/chat-store"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChatData } from "@/lib/types"
import { findUser, startNewChat } from "@/app/actions/chat-actions"
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form"
import { useSidebar } from "../ui/sidebar"

const formSchema = z.object({
    email: z.string().email("Enter a valid email address"),
})

type FormSchemaType = z.infer<typeof formSchema>

export function NewChatDialog() {
    const { setCurrentChat: setActiveChat } = useCurrentChatStore()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const { addOrUpdateUser } = useChatUserStore();
    const [open, setOpen] = useState(false);
    const { setOpenMobile } = useSidebar();

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: "" },
    })



    const onSubmit = async (values: FormSchemaType) => {
        setError(null)
        startTransition(async () => {
            const resp = await startNewChat(values.email)
            const latestMessage = null
            const latestMessageTime = new Date().toISOString()

            if (!resp.data) {
                return setError(resp.error)
            }
            const userResp = await findUser(resp.data.receiverId);
            console.log("User response:", userResp);
            if (userResp.user) {
                console.log("User found:", userResp.user);
                addOrUpdateUser(userResp.user);

            }
            const newData: ChatData = {
                ...resp.data,
                latestMessage,
                latestMessageTime,
            }

            setActiveChat(newData)
            form.reset() // clear after submission
            setOpen(false) // close dialog after successful chat start
            setOpenMobile(false);

        })
    }


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="bg-primary cursor-pointer rounded-md p-2" title="New Chat ">
                    <MessageSquareDiff className="text-sidebar" size={24} />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-secondary">
                <DialogHeader>
                    <DialogTitle>New Chat</DialogTitle>
                    <DialogDescription>
                        Enter the email address to start a new chat with a user.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Enter Email Address</FormLabel>
                                    <FormControl>
                                        <Input
                                            required
                                            autoComplete="email"
                                            disabled={isPending}
                                            placeholder="email address"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="destructive" className="cursor-pointer">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={isPending} className="cursor-pointer bg-primary text-primary-foreground">
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Starting New Chat...
                                    </>
                                ) : (
                                    "Start Chat"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>

                {error && (
                    <div className="mt-2 text-sm text-red-600">
                        <p>{error}</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
