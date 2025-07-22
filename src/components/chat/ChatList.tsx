import { useChatListInfiniteQuery } from "@/app/hooks/chat";
import { useChatClient } from "@/components/providers/ChatContextProvider";
import { ChatData, ChatListStreamRes } from "@/lib/types";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import ConversationCard from "../chatSideBar/conversation-card";
import { Loader2 } from "lucide-react";

const ChatList = () => {
    const { ref, inView } = useInView();

    const queryClient = useQueryClient();
    const { chatListClient } = useChatClient();

    // Using react-intersection-observer for infinite scroll
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error
    } = useChatListInfiniteQuery();

    // Load more chats when the load more element comes into view
    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

    // Extract all chats from all pages
    const allChats = data?.pages.flatMap(page =>
        page.success && page.chatList ? page.chatList : []
    ) || [];

    console.log(allChats);


    // Sort chats by latest message time (most recent first)
    const sortedChats = [...allChats].sort((a, b) => {
        if (!a.latestMessageTime) return 1;
        if (!b.latestMessageTime) return -1;
        return new Date(b.latestMessageTime).getTime() - new Date(a.latestMessageTime).getTime();
    });

    console.log(sortedChats);

    const handleIncomingChatListUpdate = useCallback((event: { data: string }) => {
        // console.log(event);

        try {
            const msg = JSON.parse(event.data) as ChatListStreamRes;
            console.log("Received msg", msg);

            // Check if this is a chat update
            if (msg) {
                queryClient.setQueryData(['chats', 'list'], (oldData: InfiniteData<{
                    success: boolean;
                    chatList?: ChatData[];
                }, unknown>) => {
                    if (!oldData) return oldData;

                    const pages = [...oldData.pages];
                    const updatedChatData = msg.data;

                    // Find if this chat already exists in any page
                    let chatExists = false;

                    const updatedPages = pages.map(page => {
                        if (!page.success || !page.chatList) return page;

                        const updatedChatList = page.chatList.map(chat => {

                            if (chat.chat_id === updatedChatData.chat_id) {
                                chatExists = true;


                                return { ...chat, ...updatedChatData };
                            }
                            return chat;
                        });

                        return { ...page, chatList: updatedChatList };
                    });
                    // console.log(chatExists);


                    // If chat doesn't exist, add it to the first page
                    if (!chatExists && updatedPages.length > 0 && updatedPages[0].success) {
                        updatedPages[0] = {
                            ...updatedPages[0],
                            chatList: [updatedChatData, ...(updatedPages[0].chatList || [])]
                        };
                    }

                    return {
                        ...oldData,
                        pages: updatedPages
                    };
                });
            }
        } catch (error) {
            console.error("Error handling chat list update:", error);
        }
    }, [queryClient]);

    useEffect(() => {
        if (!chatListClient) return;


        if (chatListClient) {

            chatListClient.socket.on("message", handleIncomingChatListUpdate);

            return () => {
                chatListClient.socket.off("message", handleIncomingChatListUpdate);
            };
        }
    }, [chatListClient, handleIncomingChatListUpdate]);



    return (
        <div className="flex flex-col overflow-y-auto custom-scrollbar pr-2 gap-2">
            {isLoading ? (
                <div className="p-4 text-gray-500">Loading chats...</div>
            ) : error ? (
                <div className="p-4 text-red-500">Error loading chats</div>
            ) : sortedChats.length === 0 ? (
                <div className="p-4 text-gray-500">No chats found</div>
            ) : (
                <>


                    {sortedChats.map((chat) => (

                        <ConversationCard chat={chat} key={chat.chat_id} />
                    ))}


                    {/* Load more trigger element */}
                    <div
                        ref={ref}
                        className="py-4 text-center"
                    >
                        {/* {isFetchingNextPage ? (
                            <span className="text-sm text-gray-500">Loading more...</span>
                        ) : hasNextPage ? (
                            <span className="text-sm text-gray-500">Scroll for more</span>
                        ) : sortedChats.length > 0 ? (
                            <span className="text-sm text-gray-500">No more chats</span>
                        ) : null} */}
                        {isFetchingNextPage && (
                            <div className="flex items-center justify-center">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Loading more...
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default ChatList;