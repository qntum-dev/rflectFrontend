'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';
import { Message, ChatData } from '@/lib/types';
import { useChatMessages } from '@/app/hooks/chat';
import { newChat, StreamInOut } from '@/lib/chatClient';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { useChatClient } from '../providers/ChatContextProvider';
import ActiveChatHeaderCard from '../ActiveChatHeaderCard';
import ChatInputBox from '../ChatInputBox';
import { useAuthStore } from '../stores/auth-store';

const CurrentChatNew = ({ chat }: { chat: ChatData }) => {
    const [newMessage, setNewMessage] = useState('');
    const { user } = useAuthStore();
    const [dmClient, setDmClient] = useState<StreamInOut<newChat.ReceiveMessage, newChat.SendMessage> | null>(null);
    const dmClientRef = useRef<typeof dmClient>(null);
    const virtuosoRef = useRef<VirtuosoHandle>(null);
    const [isNearBottom, setIsNearBottom] = useState(true);
    const [hasNewMessages, setHasNewMessages] = useState(false);
    const isNearBottomRef = useRef(true);

    const queryClient = useQueryClient();
    const { chatClient, chatListClient } = useChatClient();
    const isInitialLoadRef = useRef(true);
    const chatIdRef = useRef(chat.chat_id);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isSuccess } = useChatMessages(chat.chat_id);
    const messages = useMemo(() => {
        const allMessages = data?.pages.flatMap(page => page) || [];
        return allMessages
            .filter(Boolean)
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }, [data]);

    useEffect(() => {
        if (chatIdRef.current !== chat.chat_id) {
            isInitialLoadRef.current = true;
            chatIdRef.current = chat.chat_id;
            setIsNearBottom(true);
            setHasNewMessages(false);
        }
    }, [chat.chat_id]);

    useEffect(() => {
        if (isSuccess && messages.length > 0 && isInitialLoadRef.current) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    virtuosoRef.current?.scrollToIndex({
                        index: messages.length - 1,
                        behavior: 'auto',
                    });
                    isInitialLoadRef.current = false;
                });
            });
        }
    }, [isSuccess, messages.length]);

    useEffect(() => {
        if (!isInitialLoadRef.current && messages.length > 0 && isNearBottom) {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    virtuosoRef.current?.scrollToIndex({
                        index: messages.length - 1,
                        behavior: 'smooth',
                    });
                });
            });
        }
    }, [messages.length, isNearBottom]);

    useEffect(() => {
        isNearBottomRef.current = isNearBottom;
    }, [isNearBottom]);

    const handleIncomingMessage = useCallback(
        (event: { data: string }) => {
            try {
                const incoming: Message = JSON.parse(event.data);

                queryClient.setQueryData(
                    ['chatMessages', chat.chat_id],
                    (oldData: InfiniteData<Message[], unknown> | undefined) => {
                        if (!oldData) {
                            return {
                                pages: [[incoming]],
                                pageParams: [Date.now()],
                            } satisfies InfiniteData<Message[], unknown>;
                        }

                        const newPages = [...oldData.pages];
                        const isDuplicate = newPages[0]?.some((msg) => msg.id === incoming.id);
                        if (isDuplicate) return oldData;

                        newPages[0] = [...newPages[0], incoming];

                        return {
                            ...oldData,
                            pages: newPages,
                        } satisfies InfiniteData<Message[], unknown>;
                    }
                );

                if (isNearBottomRef.current) {
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            virtuosoRef.current?.scrollToIndex({
                                index: messages.length,
                                behavior: 'smooth',
                            });
                        });
                    });
                } else {
                    setHasNewMessages(true);
                }
            } catch (error) {
                console.error('Failed to parse incoming message:', error);
            }
        },
        [chat.chat_id, queryClient, messages.length]
    );


    useEffect(() => {
        if (!chatClient || !chat.chat_id) return;

        const initializeDM = async () => {
            try {
                const dmClientInstance = await chatClient.newChat.privateChat({ chatID: chat.chat_id, userID: user!.id });
                setDmClient(dmClientInstance);
                dmClientRef.current = dmClientInstance;
                dmClientInstance.socket.on('message', handleIncomingMessage);
            } catch (error) {
                console.error('Failed to initialize DM:', error);
            }
        };

        initializeDM();

        return () => {
            dmClientRef.current?.socket?.off('message', handleIncomingMessage);
            dmClientRef.current?.socket?.close();
        };
    }, [chatClient, chat.chat_id, handleIncomingMessage, user]);

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !dmClient) return;

        const messageContent = newMessage;
        setNewMessage('');

        try {
            await dmClient.send({ message: messageContent });
            chatListClient?.send({
                chat_id: chat.chat_id,
                latestMessage: messageContent,
                latestMessageTime: Date.now(),
                receiverId: chat.receiverId,
                receiverName: chat.receiverName,
            });

            // Force scroll after DOM is updated
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    virtuosoRef.current?.scrollToIndex({
                        index: messages.length + 1,
                        behavior: 'smooth',
                    });
                });
            });
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleAtBottomStateChange = (atBottom: boolean) => {
        setIsNearBottom(atBottom);
        if (atBottom) setHasNewMessages(false);
    };

    const scrollToBottom = () => {
        virtuosoRef.current?.scrollToIndex({ index: messages.length - 1, behavior: 'smooth' });
        setHasNewMessages(false);
    };

    return (
        <div className="flex flex-col w-full h-full overflow-hidden">
            <ActiveChatHeaderCard />

            <div className="flex-1 overflow-hidden h-[70dvh] w-full rounded mb-4 relative">
                <Virtuoso
                    ref={virtuosoRef}
                    data={messages}
                    startReached={() => {
                        if (!isFetchingNextPage && hasNextPage) {
                            fetchNextPage();
                        }
                    }}
                    atBottomStateChange={handleAtBottomStateChange}
                    followOutput={isNearBottom ? 'smooth' : false}
                    components={{
                        List: ({ children, ...props }) => (
                            <div
                                {...props}
                                style={{
                                    ...props.style,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: messages.length <= 10 ? 'flex-end' : 'flex-start',
                                    minHeight: '100%',
                                }}
                            >
                                {children}
                            </div>
                        ),
                    }}
                    itemContent={(index, message) => {
                        if (!message || typeof message !== 'object') {
                            return (
                                <div className="px-2 py-1">
                                    <div className="px-4 py-2 bg-gray-100 text-gray-500 rounded text-sm">
                                        Loading message...
                                    </div>
                                </div>
                            );
                        }
                        if (!('senderId' in message) || !('content' in message)) {
                            return (
                                <div className="px-2 py-1">
                                    <div className="px-4 py-2 bg-red-100 text-red-500 rounded text-sm">
                                        Invalid message format
                                    </div>
                                </div>
                            );
                        }

                        const isCurrentUser = message.senderId !== chat.receiverId;
                        return (
                            <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} w-full px-2 py-1`}>
                                <div
                                    className={`px-4 py-2 rounded-2xl max-w-[80%] break-words text-sm ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                                >
                                    <div>{message.content || ''}</div>
                                    <div className="mt-1 text-right text-xs opacity-70">
                                        {message.timestamp
                                            ? new Date(message.timestamp).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true,
                                            })
                                            : ''}
                                    </div>
                                </div>
                            </div>
                        );
                    }}
                    style={{ height: '100%', width: '100%' }}
                    className="bg-white dark:bg-neutral-900 rounded"
                />

                {hasNewMessages && (
                    <button
                        onClick={scrollToBottom}
                        className="absolute bottom-4 right-4 bg-blue-500 text-white px-3 py-2 rounded-full shadow-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                        New messages ↓
                    </button>
                )}

                {isFetchingNextPage && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded text-sm">
                        Loading older messages...
                    </div>
                )}
            </div>

            <ChatInputBox
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                handleSendMessage={handleSendMessage}
            />
        </div>
    );
};

export default CurrentChatNew;
