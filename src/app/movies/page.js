"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import MainNav from '@/components/MainNavbar';
import Link from 'next/link';
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";

const MoviesPage = () => {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [selectedGenre, setSelectedGenre] = useState('');
    const genreKey = 'movies';
    const selectedGenreKey = 'selected_genre';

    useEffect(() => {
        // Retrieve page and selectedGenre from localStorage on mount 
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
    
            console.log("Fetch URL:", url); // Debugging
    
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch movies');
                }
                const data = await response.json();
                console.log("Fetched Data:", data); // Debugging
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

    // Define the list of genres
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
                        <h1 className="text-3xl font-bold text-white">Movies</h1>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                className="px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                                placeholder="Search movies..."
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
                        {movies.map(movie => (
                            <Link key={movie.id} href={`/movies/${movie.id}`}>
                                <div className="flex flex-col h-full p-2 bg-gray-800 rounded-md shadow-md cursor-pointer">
                                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-full h-auto rounded-md" />
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
};

export default MoviesPage;