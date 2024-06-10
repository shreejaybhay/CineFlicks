/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from 'react';
import MainNav from '@/components/mainnavbar';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Link from 'next/link';
import { MdClose } from 'react-icons/md';

const ShowsDetailsPage = () => {
    const [tvShow, setTvShow] = useState(null);
    const [id, setId] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [similarShows, setSimilarShows] = useState([]);
    const [cast, setCast] = useState([]);

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

                const trailerResponse = await fetch(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=97c1ec10f492d5880ccb5f65506d37e0`);
                if (!trailerResponse.ok) {
                    throw new Error('Failed to fetch trailer');
                }
                const trailerData = await trailerResponse.json();
                const trailer = trailerData.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
                setTrailer(trailer);

                const similarResponse = await fetch(`https://api.themoviedb.org/3/tv/${id}/similar?api_key=97c1ec10f492d5880ccb5f65506d37e0`);
                if (!similarResponse.ok) {
                    throw new Error('Failed to fetch similar TV shows');
                }
                const similarData = await similarResponse.json();
                setSimilarShows(similarData.results);

                const castResponse = await fetch(`https://api.themoviedb.org/3/tv/${id}/credits?api_key=97c1ec10f492d5880ccb5f65506d37e0`);
                if (!castResponse.ok) {
                    throw new Error('Failed to fetch cast');
                }
                const castData = await castResponse.json();
                setCast(castData.cast);
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

    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    return (
        <div>
            <MainNav />
            <div className="flex items-start justify-center min-h-screen text-white bg-gray-900">
                <div className="container px-4 pb-10 mx-auto mt-8">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
                        <div className="lg:col-span-2">
                            <img src={tvShow.poster_path ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}` : 'https://eticketsolutions.com/demo/themes/e-ticket/img/movie.jpg'} alt={tvShow.name} className="w-full h-auto rounded-md" />
                        </div>
                        <div className="lg:col-span-4">
                            <h1 className="mb-4 text-4xl font-bold">{tvShow.name}</h1>
                            <p className="mb-2 text-gray-400">First Air Date: {tvShow.first_air_date}</p>
                            <p className="mb-2 text-gray-400">Rating: {tvShow.vote_average}</p>
                            <p className="mb-2 text-gray-400">Runtime: {tvShow.episode_run_time?.join(', ')} minutes</p>
                            {tvShow.genres && (
                                <p className="mb-2 text-gray-400">Genres: {tvShow.genres.map(genre => genre.name).join(', ')}</p>
                            )}
                            {tvShow.production_companies && (
                                <p className="mb-2 text-gray-400">Production Companies: {tvShow.production_companies.map(company => company.name).join(', ')}</p>
                            )}
                            <p className="mt-4 mb-4">{tvShow.overview}</p>
                            {trailer && (
                                <div className="mt-4 mb-8">
                                    <h2 className="mb-2 text-lg font-semibold text-white">Trailer</h2>
                                    <button onClick={openModal} className="px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Watch Trailer</button>
                                    {showModal && (
                                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                            <div className="absolute inset-0 bg-black opacity-75"></div>
                                            <div className="relative z-10 w-full max-w-4xl bg-gray-900 rounded-md shadow-lg">
                                                <button onClick={closeModal} className="absolute text-white top-4 right-4 hover:text-gray-400">
                                                    <MdClose size={24} />
                                                </button>
                                                <div className='w-full'>
                                                    <iframe
                                                        className="w-full h-[500px] lg:h-120"
                                                        src={`https://www.youtube.com/embed/${trailer.key}`}
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media"
                                                        allowFullScreen
                                                        title={tvShow.title}
                                                    ></iframe>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                    <div className='grid grid-cols-1 gap-10 lg:grid-cols-3'>
                        <div className="col-span-1 p-4 mt-8 bg-gray-800 rounded-md">
                            <h2 className="mb-4 text-xl font-semibold text-white">Cast</h2>
                            {cast.length > 0 ? (
                                <ul className="space-y-2">
                                    {cast.slice(0, 5).map((actor, index) => (
                                        <li key={index} className="flex items-center">
                                            <img
                                                src={actor.profile_path ? `https://image.tmdb.org/t/p/w45${actor.profile_path}` : 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg'}
                                                alt={actor.name}
                                                className="object-cover w-10 h-10 mr-3 rounded-full"
                                            />
                                            <span className="text-white">{actor.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-white">No cast information available.</p>
                            )}
                        </div>
                        {similarShows.length > 0 && (
                            <div className="col-span-2 mt-12">
                                <h2 className="mb-5 text-lg font-semibold text-white">Similar TV Shows</h2>
                                <Slider {...settings}>
                                    {similarShows.map(similarShow => (
                                        <Link key={similarShow.id} href={`/shows/${similarShow.id}`}>
                                            <div className="cursor-pointer">
                                                {similarShow.poster_path ? (
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w300${similarShow.poster_path}`}
                                                        alt={similarShow.name}
                                                        className="w-48 h-auto rounded-md"
                                                    />
                                                ) : (
                                                    <img
                                                        src="https://eticketsolutions.com/demo/themes/e-ticket/img/movie.jpg"
                                                        alt="No Poster Available"
                                                        className="w-48 h-auto rounded-md"
                                                    />
                                                )}
                                                <p className="mt-2 text-sm text-gray-400">{similarShow.name}</p>
                                            </div>
                                        </Link>
                                    ))}
                                </Slider>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShowsDetailsPage;

