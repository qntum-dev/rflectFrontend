import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { ChatData } from "@/lib/types";
import { findUser, startNewChat } from "@/app/actions/chat-actions";
import { useChatUserStore, useCurrentChatStore } from "../stores/chat-store";
import { useSidebar } from "../ui/sidebar";

const formSchema = z.object(
    {
        email: z.string().email("Enter a valid email address")
    }
);
type FormSchemaType = z.infer<typeof formSchema>;
const StartNewChatForm = () => {
    const { setCurrentChat: setActiveChat } = useCurrentChatStore();
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>();
    // const [user, setUser] = useState<PublicUser | null>()
    const { addOrUpdateUser } = useChatUserStore();
    const { setOpenMobile } = useSidebar();


    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        }
    })

    const onSubmit = async (values: FormSchemaType) => {
        setError(null)
        startTransition(async () => {
            const resp = await startNewChat(values.email);
            const latestMessage = null;
            const latestMessageTime = new Date().toISOString();

            // console.log(resp.userID);
            if (!(resp.data)) {
                // console.log(resp.error);

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
                latestMessageTime
            }

            setActiveChat(newData);
            setOpenMobile(false);

        })
    }


    return (
        <>
            <div className="">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
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
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 cursor-pointer hover:bg-blue-500"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Starting New Chat...
                                </>
                            ) : (
                                "chat by email"
                            )}
                        </Button>
                    </form>
                </Form>

                {error && (
                    <div className="">
                        <p className="">{error}</p>
                    </div>
                )}
            </div>
        </>
    );
}

export default StartNewChatForm;