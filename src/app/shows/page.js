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
    const [page, setPage] = useState(1);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedTop, setSelectedTop] = useState('');
    const selectedTopKey = 'selected_top';
    const genreKey = 'tvshows';
    const selectedGenreKey = 'selected_genre';

    useEffect(() => {
        // Retrieve page and selectedGenre from localStorage on mount 
        const savedPage = parseInt(localStorage.getItem('page'), 10) || 1;
        setPage(savedPage);

        const savedGenre = localStorage.getItem(selectedGenreKey) || '';
        setSelectedGenre(savedGenre);
    }, []);

    useEffect(() => {
        const fetchTVShows = async () => {
            const api_key = '97c1ec10f492d5880ccb5f65506d37e0';
            let url = `https://api.themoviedb.org/3/discover/tv?api_key=${api_key}&page=${page}`;
            if (searchTerm) {
                url = `https://api.themoviedb.org/3/search/tv?api_key=${api_key}&query=${encodeURIComponent(searchTerm)}&page=${page}`;
            } else if (selectedGenre) {
                url = `https://api.themoviedb.org/3/discover/tv?api_key=${api_key}&with_genres=${selectedGenre}&page=${page}`;
            } else if (selectedTop) { 
                url = `https://api.themoviedb.org/3/tv/${selectedTop}?api_key=${api_key}&page=${page}`; 
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
    }, [searchTerm, page, selectedGenre, selectedTop]);
    

    const handlePageChange = (newPage) => {
        setPage(newPage);
        // Save the current page to localStorage
        localStorage.setItem('page', newPage.toString());
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const handleGenreChange = (genre) => {
        setSelectedGenre(genre);
        setPage(1);
        localStorage.setItem(selectedGenreKey, genre);
    };
    const handleTopChange = (tops) => {
        setSelectedTop(tops);
        setPage(1);
        localStorage.setItem(selectedTopKey, tops);
    };


    // Define the list of genres with their IDs
    const genres = [
        { name: "Action", id: 10759 },
        { name: "Animation", id: 16 },
        { name: "Comedy", id: 35 },
        { name: "Crime", id: 80 },
        { name: "Documentary", id: 99 },
        { name: "Drama", id: 18 },
        { name: "Family", id: 10751 },
        { name: "History", id: 36 },
        { name: "News", id: 10763 },
        { name: "Music", id: 10402 },
        { name: "Mystery", id: 9648 },
        { name: "Romance", id: 10749 },
        { name: "Reality", id: 10764 },
        { name: "Soap", id: 10766 },
        { name: "Science Fiction", id: 10765 },
        { name: "Talk", id: 10767 },
        { name: "War", id: 10768 },
        { name: "Western", id: 37 },
    ];
    const top = [
        { name: "Top Rated", id: "top_rated" },
        { name: "Popular", id: "popular" },
        { name: "On the Air", id: "on_the_air" },
    ]

    return (
        <div>
            <MainNav />
            <div className="flex items-start justify-center min-h-screen bg-gray-900">
                <div className="container mx-auto mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-white">Shows</h1>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                className='px-4 py-2 text-black border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500'
                                placeholder='Search TV Shows...'
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <select
                                className="px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                                value={selectedGenre}
                                onChange={(e) => handleGenreChange(e.target.value)}
                            >
                                <option value="">All Genres</option>
                                {genres.map((genre) => (
                                    <option key={genre.id} value={genre.id}>{genre.name}</option>
                                ))}
                            </select>
                            <select
                                className="px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                                value={selectedTop}
                                onChange={(e) => handleTopChange(e.target.value)}
                            >
                                <option value="">All Tops</option>
                                {top.map((tops) => (
                                    <option key={tops.id} value={tops.id}>{tops.name}</option> 
                                ))}
                            </select>

                        </div>
                    </div>
                    <div className="absolute top-[140px] flex justify-start my-5 -translate-x-40">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="px-4 py-2 mx-2 text-xl font-medium text-white bg-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <GrFormPrevious />
                        </button>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            className="px-4 py-2 mx-2 text-xl font-medium text-white bg-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <MdNavigateNext />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {shows.map(tvshow => (
                            <Link key={tvshow.id} href={`/shows/${tvshow.id}`}>
                                <div className='flex flex-col h-full p-2 bg-gray-800 rounded-md shadow-md cursor-pointer'>
                                    <img src={`https://image.tmdb.org/t/p/w500${tvshow.poster_path}`} alt={tvshow.name} className="w-full h-auto rounded-md" />
                                    <div className="flex flex-col justify-between flex-grow mt-2">
                                        <h2 className="text-sm font-semibold text-gray-200">{tvshow.name} ({new Date(tvshow.first_air_date).getFullYear()})</h2>
                                        <p className="text-xs text-gray-400">Rating: {tvshow.vote_average}</p>
                                        <p className="mt-1 text-xs text-gray-400 line-clamp-3">{tvshow.overview}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                    <div className="flex justify-center my-8">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="px-4 py-2 mx-2 text-sm font-medium text-white bg-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Previous Page
                        </button>
                        <button
                            onClick={() => handlePageChange(page + 1)}
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
