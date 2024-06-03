"use client"
import React, { useState } from 'react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

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
                    <a href="#" className="text-gray-300 hover:text-white">Favorites</a>
                    <a href="#" className="text-gray-300 hover:text-white">About</a>
                </div>

                {/* Login and Signup Buttons */}
                <div className="hidden space-x-4 md:flex">
                    <a href="signin" className="px-4 py-2 text-white bg-gray-700 rounded-full hover:bg-gray-600">Login</a>
                    <a href="signup" className="px-4 py-2 text-white bg-indigo-500 rounded-full hover:bg-indigo-600">Sign Up</a>
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
                    <a href="#" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">Login</a>
                    <a href="#" className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white">Sign Up</a>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
