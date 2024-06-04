"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const MainNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                router.push('/signin'); // Redirect to the signin page after logout
            } else {
                console.error('Failed to log out');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <nav className="p-4 bg-gray-900">
            <div className="flex items-center justify-between mx-auto max-w-7xl">
                {/* Logo */}
                <div className="text-2xl font-bold text-white">
                    <a href="/">CineFlicks</a>
                </div>

                {/* Navigation Links */}
                <div className="items-center hidden space-x-8 md:flex">
                    <a href="/" className="text-gray-300 hover:text-white">Home</a>
                    <a href="/movies" className="text-gray-300 hover:text-white">Movies</a>
                    <a href="/shows" className="text-gray-300 hover:text-white">TV Shows</a>
                    <a href="/anime" className="text-gray-300 hover:text-white">Anime</a>
                    <a href="#" className="text-gray-300 hover:text-white">About</a>
                </div>

                {/* Login and Signup Buttons */}
                <div className="hidden space-x-4 md:flex">
                    <button onClick={handleLogout} className="px-4 py-2 text-white bg-indigo-500 rounded-full hover:bg-indigo-600">Log Out</button>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white focus:outline-none focus:text-white">
                        <svg className="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden">
                    <a href="#" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">Home</a>
                    <a href="#" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">Movies</a>
                    <a href="#" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">TV Shows</a>
                    <a href="#" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">Favorites</a>
                    <a href="#" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">About</a>
                    <a href="/signin" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">Login</a>
                    <a href="/signup" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">Sign Up</a>
                </div>
            )}
        </nav>
    );
}

export default MainNav;
