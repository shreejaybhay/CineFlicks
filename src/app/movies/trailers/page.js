/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from 'react';
import MainNav from '@/components/MainNavbar';
import Link from 'next/link';
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";

const TrailersPage = () => {
    const [trailers, setTrailers] = useState([]);
    const [page, setPage] = useState(1);
    const [selectedTrailer, setSelectedTrailer] = useState(null);
    const genreKey = 'trailers';

    useEffect(() => {
        // Retrieve page from localStorage on mount 
        const savedPage = parseInt(localStorage.getItem(`page_${genreKey}`), 10) || 1;
        setPage(savedPage);
    }, []);

    useEffect(() => {
        const fetchTrailers = async () => {
            const api_key = '97c1ec10f492d5880ccb5f65506d37e0';
            const url = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=${page}`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch trailers');
                }
                const data = await response.json();

                const trailerPromises = data.results.map(async movie => {
                    const trailerResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${api_key}`);
                    if (!trailerResponse.ok) {
                        throw new Error('Failed to fetch movie trailer');
                    }
                    const trailerData = await trailerResponse.json();
                    const trailer = trailerData.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
                    return trailer ? { ...movie, trailer } : null;
                });

                const trailersData = await Promise.all(trailerPromises);
                setTrailers(trailersData.filter(trailer => trailer !== null));
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (error) {
                console.error('Error fetching trailers:', error);
            }
        };

        fetchTrailers();
    }, [page]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        // Save the current page to localStorage
        localStorage.setItem(`page_${genreKey}`, newPage.toString());
    };

    const handleTrailerClick = (trailer) => {
        setSelectedTrailer(trailer);
    };

    const handleClosePopup = () => {
        setSelectedTrailer(null);
    };

    const genres = [
        "action", "adventure", "animation", "comedy", "crime",
        "documentary", "drama", "family", "fantasy", "history",
        "horror", "music", "mystery", "romance", "scienceFiction",
        "tvMovie", "thriller", "war", "western"
    ];
    // Define the list of movie categories
    const mov = [
        "trending", "trailers"
    ];

    return (
        <div>
            <MainNav />
            <div className="flex items-start justify-center min-h-screen bg-gray-900">
                <div className="container mx-auto mt-8">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-white">Movie Trailers</h1>
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
                    <div className="absolute flex justify-start my-12 top-[156px] left-5">
                    <ul className='flex flex-col items-start gap-2'>
                        {mov.map((category, index) => (
                            <li key={index} className='flex bg-black w-36'>
                                <Link href={`/movies/${category}`} className="w-full px-4 py-2 font-medium text-center text-white capitalize bg-indigo-600 rounded-md text-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">{category}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {trailers.map(movie => (
                            <div key={movie.id} className="flex flex-col h-full p-2 bg-gray-800 rounded-md shadow-md cursor-pointer" onClick={() => handleTrailerClick(movie.trailer)}>
                                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-full h-auto rounded-md" />
                                <div className="flex flex-col justify-between flex-grow mt-2">
                                    <h2 className="text-sm font-semibold text-gray-200">{movie.title} ({movie.release_date})</h2>
                                    <p className="text-xs text-gray-400">Rating: {movie.vote_average}</p>
                                </div>
                            </div>
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
                    {/* Modal for displaying the trailer */}
                    {selectedTrailer && (
                        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-75">
                            <div className="relative w-3/4 h-3/4">
                                <button className="absolute text-2xl text-white top-4 right-4 focus:outline-none" onClick={handleClosePopup}>
                                    &times;
                                </button>
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube.com/embed/${selectedTrailer.key}`}
                                    title={selectedTrailer.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrailersPage;

