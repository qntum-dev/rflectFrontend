import { baseURL } from "@/config";
import axios, { isAxiosError } from "axios";
import { getAuthCookie, setAuthCookie } from "./cookie";
import { ApiResponse } from "./types";


export const api = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 10000,

})

// Add a request interceptor
api.interceptors.request.use(async function (config) {

    const authCookie = await getAuthCookie();

    // inject auth cookie for each requests
    if (authCookie && config.headers?.set) {
        config.headers.set("Cookie", `${authCookie.name}=${authCookie.value}`);
        // console.log(authCookie);

    }

    console.log("[SERVER] Request:",
        config.baseURL! + config.url,
        config.data ? JSON.stringify(config.data) : "");

    return config

},

    function (error) {

        // console.log("[SERVER] ERROR:", error);

        // Do something with request error
        return Promise.reject(error);

    });

// Add a response interceptor
api.interceptors.response.use(async function (response) {

    // set the cookies from the response 
    if (response.headers["set-cookie"]) {
        await setAuthCookie(response)

    }

    return response;
}, function (error) {

    return Promise.reject(error);
});




// Generic API handler function for reusability
export async function apiHandler<T = undefined, R = unknown>(
    endpoint: string,
    data?: T,
    method: 'get' | 'post' | 'put' | 'patch' | 'delete' = 'get'
): Promise<ApiResponse<R>> {
    try {
        let res;
        if (method === 'get' || method === 'delete') {
            // For GET and DELETE requests, data is passed as params
            res = await api[method](endpoint, { params: data });
        } else {
            // For POST, PUT, PATCH requests, data is passed in the request body
            res = await api[method](endpoint, data);
        }

        return {
            success: true,
            data: res.data
        };
    } catch (error) {
        if (isAxiosError(error) && error.response?.data) {
            const errorMessage: string = error.response.data.message || 'Server is Busy';
            // console.log(errorMessage);

            return { success: false, error: errorMessage, data: null };
        }
        return {
            success: false,
            data: null,
            error: "Something went wrong. Please try again."
        };
    }
}