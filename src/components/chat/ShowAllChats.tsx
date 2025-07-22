"use client"


import StartNewChatForm from "./StartNewChatForm";
import ChatList from "./ChatList";
import { ChatClientProvider } from "../providers/ChatContextProvider";
import { useCurrentChatStore } from "../stores/chat-store";
import CurrentChatNew from "../newChatUi/CurrentChatNew";
import { useAuthStore } from "../stores/auth-store";
// import { use } from "react";

const ShowAllChats = () => {
    // const [activeChat, setActiveChat] = useState<ChatData | null>(null);
    const { chat: activeChat } = useCurrentChatStore();
    const { user } = useAuthStore();


    return (
        !user?.id ? (
            <div>Loading</div>
        ) : (
            <ChatClientProvider url={process.env.NEXT_PUBLIC_CHAT_URL!} userID={user!.id}>
                <div className="flex flex-col h-full">
                    <div className="max-w-sm mb-4">
                        <StartNewChatForm />
                    </div>

                    <div className="flex h-full">

                        <ChatList key="chatList" />
                        <div className="flex-1 ml-4">
                            {activeChat ? (
                                <CurrentChatNew key={activeChat.chat_id} chat={activeChat} />
                                // <CurrentChat key={activeChat.chat_id} chat={activeChat} />
                            ) : (
                                <div className="h-full flex items-center justify-center text-gray-500">
                                    Select a chat to start messaging
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </ChatClientProvider>
        )
    );
}

export default ShowAllChats;