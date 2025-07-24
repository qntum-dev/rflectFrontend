"use client"
import { ChatSidebar } from "@/components/chatSideBar/chat-sidebar";
import CurrentChatNew from "@/components/newChatUi/CurrentChatNew";
import { ChatClientProvider } from "@/components/providers/ChatContextProvider";
import { useAuthStore } from "@/components/stores/auth-store";
import { useCurrentChatStore } from "@/components/stores/chat-store";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";

const Page = () => {
    const { chat: activeChat } = useCurrentChatStore();
    const { user } = useAuthStore();

    const { toggleSidebar } = useSidebar();
    if (!user?.id) {
        return <div>Loading</div>;
    }

    return (
        !user?.id ? (
            <div>Loading</div>
        ) : (
            <ChatClientProvider url={process.env.NEXT_PUBLIC_CHAT_URL!} userID={user!.id}>

                <div className="flex h-dvh w-full bg-card items-center">
                    <ChatSidebar />

                    <div className="flex-1 ml-4 h-full">
                        {activeChat ? (
                            <CurrentChatNew key={activeChat.chat_id} chat={activeChat} />
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-4">

                                <div className="text-gray-500">
                                    Select a chat to start messaging
                                </div>
                                <Button className="cursor-pointer bg-primary text-primary-foreground md:hidden" onClick={toggleSidebar}>
                                    Select a chat
                                </Button>
                            </div>

                        )}
                    </div>
                </div>

            </ChatClientProvider>
        )
    )

}

export default Page;