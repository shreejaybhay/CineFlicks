"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import MainNav from '@/components/MainNavbar';
import Link from 'next/link';
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { BsFillMicFill } from "react-icons/bs"; // Import microphone icon

const MoviesPage = () => {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [selectedGenre, setSelectedGenre] = useState('');
    const selectedGenreKey = 'selected_genre';

    useEffect(() => {
        const savedPage = parseInt(localStorage.getItem('page'), 10) || 1;
        setPage(savedPage);

        const savedGenre = localStorage.getItem(selectedGenreKey) || '';
        setSelectedGenre(savedGenre);
    }, []);

    useEffect(() => {
        const fetchMovies = async () => {
            const api_key = '97c1ec10f492d5880ccb5f65506d37e0';
            let url = '';

            if (searchTerm) {
                url = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${encodeURIComponent(searchTerm)}&page=${page}`;
            } else if (selectedGenre) {
                url = `https://api.themoviedb.org/3/discover/movie?api_key=${api_key}&with_genres=${selectedGenre}&page=${page}`;
            } else {
                url = `https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&page=${page}`;
            }

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch movies');
                }
                const data = await response.json();
                setMovies(data.results);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (error) {
                console.error('Error fetching movies:', error);
            }
        };

        fetchMovies();
    }, [searchTerm, page, selectedGenre]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
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

    const handleVoiceSearch = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setSearchTerm(transcript);
            setPage(1);
        };

        recognition.onerror = (event) => {
            console.error('Error occurred in recognition: ', event.error);
        };
    };

    const genres = [
        { name: "Action", id: 28 },
        { name: "Adventure", id: 12 },
        { name: "Animation", id: 16 },
        { name: "Comedy", id: 35 },
        { name: "Crime", id: 80 },
        { name: "Documentary", id: 99 },
        { name: "Drama", id: 18 },
        { name: "Family", id: 10751 },
        { name: "Fantasy", id: 14 },
        { name: "History", id: 36 },
        { name: "Horror", id: 27 },
        { name: "Music", id: 10402 },
        { name: "Mystery", id: 9648 },
        { name: "Romance", id: 10749 },
        { name: "Science Fiction", id: 878 },
        { name: "TV Movie", id: 10770 },
        { name: "Thriller", id: 53 },
        { name: "War", id: 10752 },
        { name: "Western", id: 37 },
    ];

    const mov = [
        "trending", "trailers"
    ];

    return (
        <div>
            <MainNav />
            <div className="flex flex-col items-center justify-start min-h-screen bg-gray-900">
                <div className="container px-4 mx-auto mt-8">
                    <div className="flex flex-col items-center justify-between mb-4 sm:flex-row">
                        <h1 className="mb-4 text-3xl font-bold text-white sm:mb-0">Movies</h1>
                        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                            <input
                                type="text"
                                className="px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                                placeholder="Search movies..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <button
                                className="px-4 py-2 text-white bg-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={handleVoiceSearch}
                            >
                                <BsFillMicFill />
                            </button>
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
                        </div>
                    </div>

                    <div className="flex justify-between mb-4">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="px-4 py-2 mx-2 text-xl font-medium text-white bg-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
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

                    <div className="flex flex-col mb-4 space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                        <ul className='flex flex-col items-start gap-2 sm:flex-row'>
                            {mov.map((category, index) => (
                                <li key={index} className='flex w-full bg-black sm:w-36'>
                                    <Link href={`/movies/${category}`} className="w-full px-4 py-2 font-medium text-center text-white capitalize bg-indigo-600 rounded-md text-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">{category}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {movies.map(movie => (
                            <Link key={movie.id} href={`/movies/${movie.id}`}>
                                <div className="flex flex-col h-full p-2 transition-transform duration-200 transform bg-gray-800 rounded-md shadow-md cursor-pointer hover:scale-[1.02]">
                                    <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://eticketsolutions.com/demo/themes/e-ticket/img/movie.jpg'} alt={movie.title} className="w-full h-auto rounded-md" />
                                    <div className="flex flex-col justify-between flex-grow mt-2">
                                        <h2 className="text-sm font-semibold text-gray-200">{movie.title} ({new Date(movie.release_date).getFullYear()})</h2>
                                        <p className="text-xs text-gray-400">Rating: {movie.vote_average}</p>
                                        <p className="mt-1 text-xs text-gray-400 line-clamp-3">{movie.overview}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="flex justify-center my-8">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="px-4 py-2 mx-2 text-sm font-medium text-white bg-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
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
};

export default MoviesPage;

