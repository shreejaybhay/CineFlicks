/* eslint-disable react/no-unescaped-entities */
"use client"
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            const response = await fetch('/api/login', {
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
                // User logged in successfully, do something (e.g., redirect)
                router.push('/movies');
            } else {
                const { error } = await response.json();
                throw new Error(error || 'Failed to login');
            }

        } catch (error) {
            console.error('Error logging in:', error);
            setError(error.message || 'Failed to login');
        }
    };

    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center h-[calc(100vh-72px)] bg-gradient-to-br from-gray-900 to-gray-900">
                <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-extrabold text-center text-white">Sign in to your account</h2>
                    {error && (
                        <div className="flex items-center p-4 text-red-700 bg-red-100 border border-red-400 rounded">
                            <svg className="w-6 h-6 mr-2 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}
                    <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                        <div className="relative">
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
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="w-full px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full py-2 text-sm font-medium text-white transition-colors duration-300 bg-indigo-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 hover:bg-indigo-700"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                    <div className="mt-6 text-center text-gray-300">
                        Don't have an account?{' '}
                        <a href="signup" className="font-medium text-indigo-500 hover:text-indigo-600">
                            Sign up
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
