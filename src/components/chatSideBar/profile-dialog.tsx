"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import ChooseProfileImg from "../choose-profile-img";

const ProfileDialog = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <div className="bg-primary cursor-pointer rounded-md p-2" title="New Chat ">
                        <p className="text-secondary text-sm cursor-pointer">change profile photo</p>
                    </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-secondary" aria-describedby="profile image selection">
                    <ChooseProfileImg type="existing" setOpen={setOpen} />
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ProfileDialog;