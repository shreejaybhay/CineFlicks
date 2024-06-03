import { User } from "@/models/users";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/libs/db";

export async function POST(request) {
    await connectDB();
    try {
        const { email, password } = await request.json();
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const matched = bcryptjs.compareSync(password, user.password);

        if (!matched) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        const responseData = {
            message: "Logged in successfully",
            token,
            user: {
                id: user._id,
                email: user.email
            }
        };

        const response = NextResponse.json(responseData, { status: 200 });

        response.cookies.set("jwt", token, { httpOnly: true, path: '/', maxAge: 86400 });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
