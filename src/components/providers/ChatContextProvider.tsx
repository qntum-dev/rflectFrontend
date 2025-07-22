'use client';

import Client, { newChat, StreamInOut } from '@/lib/chatClient';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type ChatClientContextType = {
    chatClient: Client | null;
    chatListClient: StreamInOut<newChat.ChatListStreamReq, newChat.ChatListStreamRes> | null;
};

const ChatClientContext = createContext<ChatClientContextType | undefined>(undefined);

export const useChatClient = () => {
    const context = useContext(ChatClientContext);
    if (!context) {
        throw new Error('context fot chat client is not available');
    }
    return context;
};

type Props = {
    children: ReactNode;
    url: string;
    userID: string;
};

export const ChatClientProvider = ({ children, url, userID }: Props) => {
    const [chatClient, setChatClient] = useState<Client | null>(null);
    const [chatListClient, setChatListClient] =
        useState<StreamInOut<newChat.ChatListStreamReq, newChat.ChatListStreamRes> | null>(null);

    useEffect(() => {
        async function initializeClients() {
            const client = new Client(url);
            const listClient = await client.newChat.chatListStream({
                userID
            });

            setChatClient(client);
            setChatListClient(listClient);
        }

        initializeClients();
    }, [url, userID]);

    return (
        <ChatClientContext.Provider value={{ chatClient, chatListClient }}>
            {children}
        </ChatClientContext.Provider>
    );
};
