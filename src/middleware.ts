// import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { apiHandler } from "@/lib/api-handler";
import { getAuthCookie } from "@/lib/cookie";
import { NextRequest, NextResponse } from "next/server";

type validAuthResponse = { status: string }

export async function middleware(request: NextRequest) {



    const publicPaths = ['/login', '/register', '/recover', '/bad-request', "/", "/robots.txt", "/sitemap.xml"];
    const exemptPaths = ['/login', '/register', '/bad-request'];
    const { pathname } = request.nextUrl
    const url = request.nextUrl.clone();

    const authCookie = await getAuthCookie();
    console.log(authCookie);

    if (authCookie) {
        const res = await apiHandler<undefined, validAuthResponse>("/validate/authToken")
        console.log(res.data?.status);

        if (exemptPaths.includes(pathname)) {
            return NextResponse.next()
        }
        if (!(res.data?.status) || res.data?.status !== "valid") {

            url.pathname = "/bad-request"
            return NextResponse.redirect(url)
        }

        const verify = await apiHandler<undefined, validAuthResponse>("/verify");
        console.log(verify);

        if (pathname === '/verify') {
            console.log(verify, "line 36");

            if (verify.data?.status === "verified") {
                url.pathname = "/chat";
                return NextResponse.redirect(url);
            }
            return NextResponse.next();
        }
        // console.log(verify, "line 44");
        if (!(verify.data) || verify.data?.status !== "verified") {
            url.pathname = "/verify";
            return NextResponse.redirect(url);
        }

        return NextResponse.next()

    }

    if (publicPaths.includes(pathname)) {
        // const authToken = getAuthToken(request);


        // console.log(authToken);

        return NextResponse.next();
    }

    url.pathname = "/login"
    return NextResponse.redirect(url)
}

export const config = {
    matcher: ['/((?!_next|favicon.ico|api|turbopack|.*\\.(?:png|jpg|jpeg|webp|svg|gif)).*)'],
};

