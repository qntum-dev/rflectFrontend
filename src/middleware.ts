import { apiHandler } from "@/lib/api-handler";
import { getAuthCookie } from "@/lib/cookie";
import { NextRequest, NextResponse } from "next/server";

type ValidAuthResponse = { status: string };

// Route configuration
const ROUTES = {
    PUBLIC: ['/login', '/register', '/recover', '/bad-request', '/', '/robots.txt', '/sitemap.xml', '/forget', '/verify/reset'] as const,
    EXEMPT_FROM_AUTH_CHECK: ['/login', '/register', '/bad-request'] as const, // This list is less critical now with the new logic
    AUTH_REQUIRED: {
        LOGIN: '/login',
        VERIFY: '/verify',
        CHAT: '/chat',
        BAD_REQUEST: '/bad-request',
        REGISTER: '/register' // Added register to AUTH_REQUIRED for clarity in redirects
    }
} as const;

/**
 * Check if user has valid authentication
 */
async function validateAuthToken(): Promise<boolean> {
    try {
        const res = await apiHandler<undefined, ValidAuthResponse>("/validate/authToken");
        return res.data?.status === "valid";
    } catch (error) {
        console.error("Auth token validation failed:", error);
        return false;
    }
}

/**
 * Check if user is verified
 */
async function checkUserVerification(): Promise<boolean> {
    try {
        const res = await apiHandler<undefined, ValidAuthResponse>("/verify");
        return res.data?.status === "verified";
    } catch (error) {
        console.error("User verification check failed:", error);
        return false;
    }
}

/**
 * Create redirect response
 */
function createRedirect(request: NextRequest, path: string): NextResponse {
    const url = request.nextUrl.clone();
    url.pathname = path;
    return NextResponse.redirect(url);
}

/**
 * Handle authenticated user routing
 */
async function handleAuthenticatedUser(request: NextRequest, pathname: string): Promise<NextResponse> {
    const isValidAuth = await validateAuthToken();
    const isVerified = await checkUserVerification();

    // Check if the current path is a public route
    if ((ROUTES.PUBLIC as readonly string[]).includes(pathname)) {
        // If user is authenticated and verified, and trying to access login/register,
        // redirect them to the chat page as they are already logged in and verified.
        if (isValidAuth && isVerified && (pathname === ROUTES.AUTH_REQUIRED.LOGIN || pathname === ROUTES.AUTH_REQUIRED.REGISTER)) {
            return createRedirect(request, ROUTES.AUTH_REQUIRED.CHAT);
        }
        // For any other public path, or if not fully verified (e.g., trying to access login while authenticated but unverified),
        // allow access to the public path.
        return NextResponse.next();
    }

    // If the path is NOT a public route, it means it's a protected route.
    // First, check if the authentication token is valid.
    if (!isValidAuth) {
        // If the token is invalid, redirect to a bad request page or login.
        // Using BAD_REQUEST as per original logic, but LOGIN might be more user-friendly.
        return createRedirect(request, ROUTES.AUTH_REQUIRED.BAD_REQUEST);
    }

    // If the authentication token is valid, but the user is not verified,
    // and they are not already on the verification page, redirect them to verify.
    if (!isVerified && pathname !== ROUTES.AUTH_REQUIRED.VERIFY) {
        return createRedirect(request, ROUTES.AUTH_REQUIRED.VERIFY);
    }

    // If the user is verified and they are trying to access the verification page,
    // redirect them to the chat page as they no longer need to verify.
    if (isVerified && pathname === ROUTES.AUTH_REQUIRED.VERIFY) {
        return createRedirect(request, ROUTES.AUTH_REQUIRED.CHAT);
    }

    // For all other cases (authenticated, verified, and accessing a protected route),
    // allow the request to proceed.
    return NextResponse.next();
}

/**
 * Handle unauthenticated user routing
 */
function handleUnauthenticatedUser(request: NextRequest, pathname: string): NextResponse {
    // Allow access to public paths for unauthenticated users
    if ((ROUTES.PUBLIC as readonly string[]).includes(pathname)) {
        return NextResponse.next();
    }

    // For any other path (protected routes), redirect unauthenticated users to login
    return createRedirect(request, ROUTES.AUTH_REQUIRED.LOGIN);
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    try {
        const authCookie = await getAuthCookie();
        console.log("Auth cookie present:", !!authCookie);

        if (authCookie) {
            // If an auth cookie is present, handle as an authenticated user
            return await handleAuthenticatedUser(request, pathname);
        } else {
            // If no auth cookie, handle as an unauthenticated user
            return handleUnauthenticatedUser(request, pathname);
        }
    } catch (error) {
        console.error("Middleware error:", error);
        // Fallback to login on any unexpected error during middleware execution
        return createRedirect(request, ROUTES.AUTH_REQUIRED.LOGIN);
    }
}

export const config = {
    // Match all paths except API routes, static files, and Next.js internal paths
    matcher: ['/((?!_next|favicon.ico|api|turbopack|.*\\.(?:png|jpg|jpeg|webp|svg|gif)).*)'],
};
