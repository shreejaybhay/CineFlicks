/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from 'react';
import MainNav from '@/components/MainNavbar';

const ShowsDetailsPage = () => {
    const [tvShow, setTvShow] = useState(null);
    const [id, setId] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const pathParts = window.location.pathname.split('/');
        const tvShowId = pathParts[pathParts.length - 1];
        setId(tvShowId);

        const fetchTvShowDetails = async () => {
            try {
                if (!id) return;
                const response = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=97c1ec10f492d5880ccb5f65506d37e0`);
                if (!response.ok) {
                    throw new Error('Failed to fetch TV show details');
                }
                const data = await response.json();
                setTvShow(data);

                // Fetch trailer
                const trailerResponse = await fetch(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=97c1ec10f492d5880ccb5f65506d37e0`);
                if (!trailerResponse.ok) {
                    throw new Error('Failed to fetch trailer');
                }
                const trailerData = await trailerResponse.json();
                const trailer = trailerData.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
                setTrailer(trailer);
            } catch (error) {
                console.error('Error fetching TV show details:', error);
            }
        };

        fetchTvShowDetails();
    }, [id]);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    if (!tvShow) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div>Loading...</div>
            </div>
        );
    }

    return (
        <div>
            <MainNav />
            <div className="flex items-start justify-center min-h-screen bg-gray-900">
                <div className="container mx-auto mt-8">
                    <div className="grid grid-cols-5">
                        <div className="col-span-1 mr-8">
                            <img src={tvShow.poster_path ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image+Available'} alt={tvShow.name} className="w-64 h-auto rounded-md" />
                        </div>
                        <div className="col-span-4 text-white">
                            <h1 className="text-3xl font-bold">{tvShow.name}</h1>
                            <p className="text-gray-400">First Air Date: {tvShow.first_air_date}</p>
                            <p className="text-gray-400">Rating: {tvShow.vote_average}</p>
                            <p className="text-gray-400">Runtime: {tvShow.episode_run_time?.join(', ')} minutes</p>
                            {tvShow.genres && (
                                <p className="text-gray-400">Genres: {tvShow.genres.map(genre => genre.name).join(', ')}</p>
                            )}
                            {tvShow.production_companies && (
                                <p className="text-gray-400">Production Companies: {tvShow.production_companies.map(company => company.name).join(', ')}</p>
                            )}
                            <p className="mt-2">{tvShow.overview}</p>
                            {trailer && (
                                <div className="mt-4">
                                    <h2 className="text-lg font-semibold text-white">Trailer</h2>
                                    <button onClick={openModal} className="px-4 py-2 mt-2 text-white bg-indigo-500 rounded-md hover:bg-indigo-600">Watch Trailer</button>
                                    {showModal && (
                                        <div className="fixed inset-0 z-50 flex items-center justify-center">
                                            <div className="absolute inset-0 bg-black opacity-50"></div>
                                            <div className="relative z-10 w-3/4 bg-gray-900 rounded-md p-9 h-3/4">
                                                <button onClick={closeModal} className="absolute top-0 right-0 m-4 text-gray-600 hover:text-gray-800">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                                <iframe
                                                    className='w-full h-full'
                                                    src={`https://www.youtube.com/embed/${trailer.key}`}
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                    title={tvShow.name}
                                                ></iframe>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowsDetailsPage;
