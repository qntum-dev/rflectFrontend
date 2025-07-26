"use client"
import ChooseProfileImg from "@/components/choose-profile-img";
import { useEffect } from "react";

const Page = () => {
    useEffect(() => {
        console.log("Profile page rendered");
    }, []);
    return (
        <div className="flex items-center justify-center h-dvh bg-gray-950 w-full">
            <ChooseProfileImg type="new" />
        </div>
    );
}

export default Page;