import { NextResponse } from "next/server";

export async function POST(request) {
    const response = NextResponse.json({
        message: "Logged Out!",
        success: true
    });

    response.cookies.set("jwt", "", {
        httpOnly: true,
        expires: new Date(0) // Expire immediately
    });

    return response;
}
