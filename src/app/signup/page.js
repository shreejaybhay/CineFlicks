"use client";
import Navbar from '@/components/navbar';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter()
    const handleSignup = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (!isValidEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!isValidPassword(password)) {
            setError('Password must be at least 8 characters long');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            if (response.ok) {
                const data = await response.json();
                // User created successfully, do something (e.g., redirect)
                setEmail('')
                setPassword('')
                setConfirmPassword('')
                router.push('/signin')
                console.log('User created:', data);
            } else {
                const { error } = await response.json();
                throw new Error(error || 'Failed to create user');
            }

        } catch (error) {
            console.error('Error signing up:', error);
            setError(error.message || 'Failed to create user');
        }
    };

    // Function to validate email format
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Function to validate password length
    const isValidPassword = (password) => {
        return password.length >= 8;
    };

    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center h-[calc(100vh-72px)] bg-gray-900">
                <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-extrabold text-center text-white">Create an account</h2>
                    {error && (
                        <div className="p-2 text-red-700 bg-red-100 border border-red-400 rounded">
                            {error}
                        </div>
                    )}
                    <form className="mt-8 space-y-6" onSubmit={handleSignup}>
                        <div className="relative rounded-full">
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="relative rounded-full">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="relative rounded-full">
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full py-2 text-sm font-medium text-white bg-indigo-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Sign up
                            </button>
                        </div>
                    </form>
                    <div className="mt-6 text-center text-gray-300">
                        Already have an account?{' '}
                        <a href="signin" className="font-medium text-indigo-500 hover:text-indigo-600">
                            Sign in
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;

