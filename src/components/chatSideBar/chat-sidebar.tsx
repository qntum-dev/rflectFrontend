
"use client"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader
} from "@/components/ui/sidebar"
import { useAuthStore } from "../stores/auth-store"
import Image from "next/image";
import { LogOut, Moon, Sun } from "lucide-react";
import { NewChatDialog } from "./new-chat-dialog";
import ChatList from "../chat/ChatList";
import { useTheme } from "next-themes";
import ProfileDialog from "./profile-dialog";
import Navlogo from "../navlogo";

export function ChatSidebar() {
    const user = useAuthStore((state) => state.user);
    const { setTheme, theme } = useTheme()
    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });

        useAuthStore.getState().logout();

        window.location.href = '/';
    }
    return (
        <Sidebar>

            <SidebarHeader className="bg-[#030a17] ">
                <div className="flex justify-between items-center w-full">
                    {/* <h1 className="text-2xl text-white">Rflect</h1> */}
                    <Navlogo size={100} />
                    {/* <a href="#" className="text-xl font-bold cursor-pointer flex items-center">
                    </a> */}

                    <NewChatDialog />
                </div>
            </SidebarHeader>
            <SidebarContent className="">
                <ChatList />

            </SidebarContent>

            <SidebarFooter>
                <div className="bg-primary flex items-center py-2 px-3 rounded-full justify-between mx-2 lg:mx-8 mb-4">
                    <div className="flex items-center gap-3">
                        <div>
                            <Image
                                src={user?.profileImgUrl || `https://avatar.iran.liara.run/username?username=[${user?.name}]`}
                                alt="Profile Picture"
                                width={64}
                                height={64}
                                className="rounded-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col items-start">
                            <p className="text-primary-foreground text-lg">{user?.name}</p>
                            <ProfileDialog />
                            {/* <p className="text-secondary text-sm cursor-pointer">change profile photo</p> */}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="cursor-pointer" title="Logout" onClick={handleLogout}>

                            <LogOut className="text-red-600 " size={24} />
                        </div>
                        <div className="cursor-pointer" title={theme === 'dark' ? "Light Mode" : "Dark Mode"} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                            {
                                theme === 'dark' ? (
                                    <Sun className="text-blue-600" size={24} />
                                ) : (
                                    <Moon className="text-yellow-500" size={24} />
                                )
                            }
                        </div>
                    </div>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
