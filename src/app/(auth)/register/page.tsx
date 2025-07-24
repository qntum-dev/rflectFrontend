import { Metadata } from "next";
import RegisterForm from "../register-form";
export const metadata: Metadata = {
    title: 'Sign up for Rflect',
    description: 'Create your account',
}

const page = () => {
    return (
        <div className="h-dvh w-full flex items-center justify-center">
            <RegisterForm />

        </div>
    );
}

export default page;