"use client"

import { ChatData } from "@/lib/types";
import { useChatUserStore, useCurrentChatStore } from "../stores/chat-store";
import { startChat } from "@/app/actions/chat-actions";
import Image from "next/image";
import { useFindChatUser } from "@/app/hooks/chat";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";
import { useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "../ui/sidebar";

const ConversationCard = ({ chat }: { chat: ChatData }) => {
    const { chat: activeChat, setCurrentChat: setActiveChat } = useCurrentChatStore();
    const isMobile = useIsMobile();
    const { data: userData } = useFindChatUser(chat.receiverId);
    const { setOpenMobile } = useSidebar();
    const { addOrUpdateUser } = useChatUserStore();

    useEffect(() => {
        if (userData?.user) {
            addOrUpdateUser(userData.user);
        }
    }, [userData?.user, addOrUpdateUser]);

    const fallbackName = userData?.user?.name || chat.receiverName || "Unknown";
    const fallbackAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}`;

    return (
        <div
            onClick={async () => {
                if (activeChat?.chat_id !== chat.chat_id) {
                    const { status } = await startChat(chat.receiverId);
                    if (status) {
                        setActiveChat(chat);
                    }
                }
                if (isMobile) {
                    setOpenMobile(false);
                }
            }}
            className={`flex items-start py-4 px-6 justify-between cursor-pointer rounded-lg transition-colors ${activeChat?.chat_id === chat.chat_id
                ? 'bg-[#092458] text-white'
                : 'hover:bg-secondary'
                }`}
            key={chat.chat_id}
        >
            <div className="flex items-center gap-3 w-full min-w-0"> {/* added min-w-0 */}
                <div className="flex-shrink-0"> {/* prevent image shrink */}
                    <Image
                        src={userData?.user?.profileImgUrl || fallbackAvatarUrl}
                        alt="Profile Picture"
                        width={64}
                        height={64}
                        className="rounded-full object-cover"
                    />
                </div>
                <div className="flex flex-col gap-1 justify-between w-full overflow-hidden"> {/* overflow-hidden */}
                    <div className="w-full flex justify-between items-center min-w-0"> {/* min-w-0 */}
                        <p className="text-base font-medium truncate" title={chat.receiverName}>
                            {chat.receiverName}
                        </p>
                        {chat.latestMessageTime && (
                            <p className="text-xs opacity-70 flex-shrink-0">
                                {(() => {
                                    const date = new Date(chat.latestMessageTime);
                                    if (isToday(date)) {
                                        return format(date, "hh:mm a");
                                    } else if (isYesterday(date)) {
                                        return "yesterday";
                                    } else if (isThisWeek(date)) {
                                        return format(date, "EEEE");
                                    } else {
                                        return format(date, "dd/MM/yyyy");
                                    }
                                })()}
                            </p>
                        )}
                    </div>
                    {chat.latestMessage && (
                        <p
                            className="text-sm opacity-80 truncate"
                            title={chat.latestMessage}
                        >
                            {chat.latestMessage}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConversationCard;
