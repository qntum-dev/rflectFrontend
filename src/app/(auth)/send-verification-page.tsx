"use client"
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import VerifyOTPForm from "./verify-otp-form";
import { sendACVerification } from "../actions/auth-actions";

const VerifyPage = () => {
    const [showVerifyOTPForm, setShowVerifyForm] = useState(false);
    const [ErrMSG, setErrMSG] = useState<string | undefined>()
    const [isPending, startTransition] = useTransition();

    const onSendOTP = async () => {
        startTransition(async () => {

            const { success, data, error } = await sendACVerification()

            if (success) {
                console.log(data);
                setShowVerifyForm(true)
            }
            if (error) {

                setErrMSG(error)
            }
        })

    }

    return (
        <div className="h-dvh w-full flex items-center justify-center bg-gray-950">

            {showVerifyOTPForm
                ?

                <VerifyOTPForm />

                :

                <div className="flex flex-col justify-center items-center gap-4 lg:gap-6">
                    <h1 className="text-xl lg:text-4xl font-bold text-center">

                        Please Verify your Account
                    </h1>
                    {ErrMSG && <div className="text-red-500 text-sm">
                        {ErrMSG}
                    </div>}
                    <Button className="bg-blue-600 text-white cursor-pointer hover:bg-blue-500" disabled={isPending}
                        onClick={onSendOTP}>{

                            isPending ? <>

                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending OTP
                            </>
                                : "Send OTP"
                        }</Button>
                </div>}
        </div>

    );
}

export default VerifyPage;