"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        // Check if the user is logged in on component mount
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            setUser(user);
        }
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Clear user data from localStorage
                localStorage.removeItem('user');
                setUser(null);
                // No need to redirect here, navbar will update based on the user state
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
                <div className="text-2xl font-bold text-white">
                    <a href="/">CineFlicks</a>
                </div>

                <div className="items-center hidden space-x-8 md:flex">
                    <Link href="/" className="text-gray-300 hover:text-white">Home</Link>
                    <Link href="/movies" className="text-gray-300 hover:text-white">Movies</Link>
                    <Link href="/shows" className="text-gray-300 hover:text-white">TV Shows</Link>
                    <Link href="/anime" className="text-gray-300 hover:text-white">Anime</Link>
                    <Link href="#" className="text-gray-300 hover:text-white">About</Link>
                </div>

                <div className="hidden space-x-4 md:flex">
                    {user ? (
                        <button onClick={handleLogout} className="px-4 py-2 text-white bg-indigo-500 rounded-full hover:bg-indigo-600">Log Out</button>
                    ) : (
                        <div className='flex gap-2'>
                            <Link href="/signin" className="px-4 py-2 text-white bg-gray-700 rounded-full hover:bg-gray-600">Login</Link>
                            <Link href="/signup" className="px-4 py-2 text-white bg-indigo-500 rounded-full hover:bg-indigo-600">Sign Up</Link>
                        </div>
                    )}
                </div>

                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-gray-300 hover:text-white focus:outline-none focus:text-white">
                        <svg className="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
                        </svg>
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden">
                    <Link href="/" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">Home</Link>
                    <Link href="/movies" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">Movies</Link>
                    <Link href="/shows" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">TV Shows</Link>
                    <Link href="/anime" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">Anime</Link>
                    <Link href="#" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">About</Link>
                    <Link href="/signin" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">Login</Link>
                    <Link href="/signup" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">Sign Up</Link>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
