import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { findUser, getChatList, getMessages } from '@/app/actions/chat-actions';

export function useChatMessages(chatID: string) {
    return useInfiniteQuery({
        queryKey: ['chatMessages', chatID],
        queryFn: async ({ pageParam }) => {
            console.log("Fetching messages for chat:", chatID, "with pageParam:", pageParam);
            const result = await getMessages(chatID, pageParam, 20);
            return result.success ? result.messages || [] : [];
        },
        getNextPageParam: (lastPage) => {
            if (!lastPage || lastPage.length === 0) return undefined; // No more messages
            if (lastPage.length < 20) return undefined; // If we got less than the page size, there are no more

            const oldestMessage = lastPage[lastPage.length - 1];
            return oldestMessage ? new Date(oldestMessage.timestamp).getTime() : undefined;
        },
        initialPageParam: Date.now(), // Start fetching from current time
        refetchOnMount: true,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60, // Consider data fresh for 1 minute
    });
}

// Function to get the current ISO date string
const getCurrentDateISOString = () => new Date().toISOString();

export const useChatListInfiniteQuery = (limit = 20) => {
    return useInfiniteQuery({
        queryKey: ['chats', 'list'],

        queryFn: async ({ pageParam }) => {
            // For first page, use current date as the 'before' value
            const response = await getChatList(pageParam, limit);
            console.log(response);

            return response;
        },

        getNextPageParam: (lastPage) => {
            // If no data or less than limit items returned, we've reached the end
            if (!lastPage.success || !lastPage.chatList || lastPage.chatList.length < limit) {
                return null;
            }

            // Get the timestamp of the last chat to use as the 'before' cursor
            const lastChat = lastPage.chatList[lastPage.chatList.length - 1];
            return lastChat?.latestMessageTime || null;
        },

        initialPageParam: getCurrentDateISOString(),
    });
};



export const useFindChatUser = (id: string) => {
    return useQuery({
        queryKey: ['chat', 'user', id],
        queryFn: async () => {
            const resp = await findUser(id);
            return resp;
        },
        staleTime: 1000 * 60 * 60, // 1 hour
    });
}