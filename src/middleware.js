import { connectDB } from "./libs/db";
import { NextResponse } from "next/server";

export async function middleware(request) {
    console.log("Middleware executed");
    await connectDB();

    const authToken = request.cookies.get("jwt")?.value;
    console.log("Auth Token:", authToken); // Debugging

    const { pathname } = request.nextUrl;
    console.log("Pathname:", pathname); // Debugging

    const isPublicRoute = ["/signin", "/signup"].includes(pathname);
    const isProtectedRoute = ["/movies", "/shows"].includes(pathname);

    if (isPublicRoute && authToken) {
        // Authenticated users should not access login or signup pages
        return NextResponse.redirect(new URL("/movies", request.url));
    }

    if (isProtectedRoute && !authToken) {
        // Unauthenticated users should not access protected routes
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/signin",
        "/signup",
        "/movies",
        "/shows",
    ],
};
