import { AxiosResponse } from "axios";
import { cookies } from "next/headers";

export const getAuthCookie = async () => {
    const cookieStore = await cookies();
    const authCookie = cookieStore.getAll().find((c) => c.name === "authToken");
    return authCookie
}

export const setAuthCookie = async (res: AxiosResponse) => {
    const cookieStore = await cookies();

    res.headers['set-cookie']?.forEach(cookie => {
        const [name, ...rest] = cookie.split('=');
        const value = rest.join('=').split(';')[0];
        cookieStore.set(name, value);
    });


}

