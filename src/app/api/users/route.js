const { connectDB } = require("@/libs/db");
import { User } from "@/models/users";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";

connectDB()


export async function POST(request) {
    try {
        // Extracting user data from the request body
        const { email, password } = await request.json();

        // Validate email
        if (!isValidEmail(email)) {
            throw new Error('Invalid email address');
        }

        // Validate password
        if (!isValidPassword(password)) {
            throw new Error('Password must be at least 8 characters long');
        }

        // Hashing the password 
        const hashedPassword = await bcryptjs.hash(password, parseInt(process.env.BCRYPT_SALT));

        // Creating a new user instance with the extracted data
        const user = new User({ email, password: hashedPassword });

        // Saving the new user to the database 
        const createdUser = await user.save();

        // Customizing the response body with relevant user data
        const responseData = {
            id: createdUser._id,
            email: createdUser.email,
        };

        // Creating a JSON response with the custom data and status 201 (Created)
        const response = NextResponse.json(responseData, { status: 201 });

        // Returning the response
        return response;
    } catch (error) {
        // If an error occurs during user creation or saving 
        console.error("Error creating user:", error);

        // Handling the error
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email === 1) {
            // If the error is a duplicate key error for the email field
            const errorMessage = 'Email is already in use';
            const errorResponse = NextResponse.json({ error: errorMessage }, { status: 400 });
            return errorResponse;
        } else {
            // For other errors, return a generic error message
            const errorResponse = NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
            return errorResponse;
        }
    }
}

// Function to validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to validate password length
function isValidPassword(password) {
    return password.length >= 8;
}

export async function GET(request) {
    let users = []
    try {
        users = await User.find()
    } catch (error) {
        // Logging the error to the console for debugging
        console.error(error);
        // Returning a 500 Internal Server Error response with an error message
        return NextResponse.json({ message: "Error retrieving data" }, { status: 500 });
    }
    // Returning the fetched users as a JSON response
    return NextResponse.json(users, { status: 200 }); // Adding a 200 OK status explicitly
}