/* eslint-disable @next/next/no-img-element */
"use client";
import MainNav from '@/components/MainNavbar';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";

const ShowsPage = () => {
    const [shows, setShows] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(() => {
        // Retrieve page from localStorage or default to 1
        return parseInt(localStorage.getItem('page'), 10) || 1;
    });

    useEffect(() => {
        // Save the current page to localStorage
        localStorage.setItem('page', page.toString());
    }, [page]);

    useEffect(() => {
        const fetchTVShows = async () => {
            const api_key = '97c1ec10f492d5880ccb5f65506d37e0';
            let url = `https://api.themoviedb.org/3/discover/tv?api_key=${api_key}&page=${page}`;
            if (searchTerm) {
                url = `https://api.themoviedb.org/3/search/tv?api_key=${api_key}&query=${encodeURIComponent(searchTerm)}&page=${page}`;
            }

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch TV Shows');
                }
                const data = await response.json();
                setShows(data.results);
                // Scroll to the top of the page
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (error) {
                console.error('Error fetching TV Shows:', error);
            }
        };

        fetchTVShows();
    }, [searchTerm, page]);

    const filteredShows = shows.filter(show =>
        show.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Define the list of genres
    const genres = [
        "action",
        "animation",
        "comedy",
        "crime",
        "documentary",
        "drama",
        "family",
        "history",
        "news",
        "music",
        "mystery",
        "romance",
        "reality",
        "soap",
        "scienceFiction",
        "talk",
        "war",
        "western"
    ];
    return (
        <div>
            <MainNav />
            <div className="flex items-start justify-center min-h-screen bg-gray-900">
                <div className="container mx-auto mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-white">Shows</h1>
                        <input
                            type="text"
                            className='px-4 py-2 text-black border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500'
                            placeholder='Search TV Shows...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="absolute top-[140px] flex justify-start my-5 -translate-x-40">
                        <button
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                            className="px-4 py-2 mx-2 text-xl font-medium text-white bg-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <GrFormPrevious />
                        </button>
                        <button
                            onClick={() => setPage(page + 1)}
                            className="px-4 py-2 mx-2 text-xl font-medium text-white bg-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <MdNavigateNext />
                        </button>
                    </div>
                    <div className="absolute flex justify-start my-12 -translate-x-40">
                        <ul className='flex flex-col items-start gap-2'>
                            {genres.map((genre, index) => (
                                <li key={index} className='flex bg-black w-36'>
                                    <Link href={`/shows/${genre}`} className="w-full px-4 py-2 font-medium text-center text-white capitalize bg-indigo-600 rounded-md text-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">{genre}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {filteredShows.map(tvshow => (
                            <Link key={tvshow.id} href={`/shows/${tvshow.id}`}>
                                <div className='flex flex-col h-full p-2 bg-gray-800 rounded-md shadow-md cursor-pointer'>
                                    <img src={`https://image.tmdb.org/t/p/w500${tvshow.poster_path}`} alt={tvshow.name} className="w-full h-auto rounded-md" />
                                    <div className="flex flex-col justify-between flex-grow mt-2">
                                        <h2 className="text-sm font-semibold text-gray-200">{tvshow.name} ({tvshow.first_air_date})</h2>
                                        <p className="text-xs text-gray-400">Rating: {tvshow.vote_average}</p>
                                        <p className="mt-1 text-xs text-gray-400 line-clamp-3">{tvshow.overview}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="flex justify-center my-8">
                        <button
                            onClick={() => setPage(prevPage => prevPage - 1)}
                            disabled={page === 1}
                            className="px-4 py-2 mx-2 text-sm font-medium text-white bg-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Previous Page
                        </button>
                        <button
                            onClick={() => setPage(prevPage => prevPage + 1)}
                            className="px-4 py-2 mx-2 text-sm font-medium text-white bg-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Next Page
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShowsPage;
