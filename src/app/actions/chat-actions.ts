"use server"

import { apiHandler } from "@/lib/api-handler";
import { ChatData, ChatListResponse, StartChatData, Message } from "@/lib/types";
import { PublicUser } from "@/lib/types";

export const getAllChats = async () => {
    const chats = await apiHandler<undefined, ChatData>("/chat/getAll");

    return chats.data

}

interface StartChatBody {
    userB: string
}
interface StartNewChatBody {
    email: string
}

interface StartChatResp {
    status: string
    chatID: string
}





export interface FindUserResp {
    user: PublicUser | null,
    error: string | null
}

export const findUser = async (id: string): Promise<FindUserResp> => {
    const resp = await apiHandler<undefined, PublicUser>(`/getUser?id=${id}`);
    // console.log(resp);

    if (resp.error) {
        return {
            user: null,
            error: resp.error
        }
    }
    if (!resp.data) {
        return {
            user: null,
            error: "User not found"
        }
    }
    return {
        user: resp.data,
        error: null
    }

}


// interface 
export const startChat = async (userID: string): Promise<{ status: boolean }> => {

    const resp = await apiHandler<StartChatBody, StartChatResp>("/start-chat", {
        userB: userID
    }, "post")

    console.log(resp);

    if (resp.data?.chatID) return {
        status: true
    }
    return { status: false }
    // console.log(re);

}

export const startNewChat = async (email: string): Promise<{
    data: StartChatData | null, error: string | null,
}> => {

    const resp = await apiHandler<StartNewChatBody, StartChatData>(`/newChat?email=${email}`)
    console.log(resp);

    if (resp.error) {
        return {
            data: null,
            error: resp.error
        }
    }
    if (!resp.data) {
        return {
            data: null, error: "Chat could not be created"
        }
    }

    return {
        data: resp.data,
        error: null
    }
    // console.log(re);

}



export const getMessages = async (chatID: string, before?: number, limit?: number): Promise<{ success: boolean, messages?: Message[] }> => {
    const params = new URLSearchParams();
    if (before) params.append("before", before.toString());
    if (limit) params.append("limit", limit.toString());

    const resp = await apiHandler<undefined, { messages: Message[] }>(`/getMessages/${chatID}?${params.toString()}`)
    if (!resp.data) {
        return {
            success: false
        }
    }
    // console.log(resp.data);

    return {
        success: true,
        messages: resp.data.messages
    }
}


export const getChatList = async (before?: string, limit?: number): Promise<{ success: boolean, chatList?: ChatData[] }> => {
    const params = new URLSearchParams();
    if (before) params.append("before", before.toString());
    if (limit) params.append("limit", limit.toString());

    const resp = await apiHandler<undefined, ChatListResponse>(`/chat/getAllChats?${params.toString()}`)

    console.log(resp.data?.chatListData);

    if (!resp.data) {
        return {
            success: false
        }
    }
    // console.log(resp.data);

    return {
        success: true,
        chatList: resp.data.chatListData
    }
}