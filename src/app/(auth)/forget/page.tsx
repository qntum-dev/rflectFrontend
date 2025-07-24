import { Metadata } from "next";
import ForgetForm from "../forget-form";
export const metadata: Metadata = {
    title: 'Forget Account',
    description: 'Send a reset password email to your account',
}
const Page = () => {
    return (
        <ForgetForm />
    );
}

export default Page;