import { Metadata } from "next";
import LoginForm from "../login-form";

export const metadata: Metadata = {
    title: 'Rflect - log in or sign up',
    description: 'Log in to your account',
}

const page = () => {

    return (
        <div className="h-dvh flex items-center justify-center">
            <LoginForm />
        </div>
    );
}

export default page;