import { create } from 'zustand'
import { ChatData, PublicUser } from '@/lib/types'

interface CurrentChatStore {
    chat: ChatData | null
    setCurrentChat: (chat: ChatData | null) => void
}

export const useCurrentChatStore = create<CurrentChatStore>(
    (set) => ({
        chat: null,
        setCurrentChat: (chat: ChatData | null) => set({ chat })
    })
    // persist(
    // )
)

export const useChatUserStore = create<{
    userList: PublicUser[]
    setUserList: (userList: PublicUser[]) => void
    addOrUpdateUser: (user: PublicUser) => void
}>((set, get) => ({
    userList: [],
    setUserList: (userList) => set({ userList }),
    addOrUpdateUser: (user) => {
        const { userList } = get();
        const existingIndex = userList.findIndex(u => u.id === user.id);
        if (existingIndex !== -1) {
            const updatedList = [...userList];
            updatedList[existingIndex] = user;
            set({ userList: updatedList });
        } else {
            set({ userList: [...userList, user] });
        }
    }
}));
