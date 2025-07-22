"use client"
import { ChatSidebar } from "@/components/chatSideBar/chat-sidebar";
import CurrentChatNew from "@/components/newChatUi/CurrentChatNew";
import { ChatClientProvider } from "@/components/providers/ChatContextProvider";
import { useAuthStore } from "@/components/stores/auth-store";
import { useCurrentChatStore } from "@/components/stores/chat-store";
import { SidebarProvider } from "@/components/ui/sidebar";

const Page = () => {
    const { chat: activeChat } = useCurrentChatStore();
    const { user } = useAuthStore();


    if (!user?.id) {
        return <div>Loading</div>;
    }

    return (
        !user?.id ? (
            <div>Loading</div>
        ) : (
            <ChatClientProvider url={process.env.NEXT_PUBLIC_CHAT_URL!} userID={user!.id}>

                <div>
                    <SidebarProvider>
                        <ChatSidebar />

                        <div className="w-full">
                            {activeChat ? (
                                <CurrentChatNew key={activeChat.chat_id} chat={activeChat} />
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-500">
                                    Select a chat to start messaging
                                </div>
                            )}
                        </div>
                    </SidebarProvider>
                </div>
            </ChatClientProvider>
        )
    )

}

export default Page;