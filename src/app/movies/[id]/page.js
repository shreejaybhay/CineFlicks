/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState } from 'react';
import MainNav from '@/components/MainNavbar';
import Link from 'next/link';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { AiOutlineDownload } from 'react-icons/ai';
import { MdClose } from 'react-icons/md';

const MovieDetailsPage = () => {
    const [movie, setMovie] = useState(null);
    const [id, setId] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [downloadLinks, setDownloadLinks] = useState([]);
    const [similarMovies, setSimilarMovies] = useState([]);
    const [cast, setCast] = useState([]);

    useEffect(() => {
        const pathParts = window.location.pathname.split('/');
        const movieId = pathParts[pathParts.length - 1];
        setId(movieId);

        const fetchMovieDetails = async () => {
            try {
                if (!id) return;

                const apiKey = '97c1ec10f492d5880ccb5f65506d37e0';
                const responses = await Promise.all([
                    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`),
                    fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`),
                    fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=${apiKey}`),
                    fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`),
                ]);

                if (responses.some(res => !res.ok)) {
                    throw new Error('Failed to fetch data');
                }

                const [movieData, trailerData, similarData, castData] = await Promise.all(responses.map(res => res.json()));

                setMovie(movieData);
                setTrailer(trailerData.results.find(video => video.type === 'Trailer' && video.site === 'YouTube'));
                setSimilarMovies(similarData.results);
                setCast(castData.cast);

                const ytsResponse = await fetch(`https://yts.mx/api/v2/list_movies.json?query_term=${encodeURIComponent(movieData.title)}`);
                if (!ytsResponse.ok) {
                    throw new Error('Failed to fetch download links');
                }
                const ytsData = await ytsResponse.json();
                if (ytsData.data.movie_count > 0) {
                    setDownloadLinks(ytsData.data.movies[0].torrents);
                }
            } catch (error) {
                console.error('Error fetching movie details:', error);
            }
        };

        fetchMovieDetails();
    }, [id]);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 1 } },
            { breakpoint: 600, settings: { slidesToShow: 2, slidesToScroll: 1 } },
            { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
    };

    if (!movie) {
        return (
            <div className="flex items-center justify-center min-h-screen text-white bg-gray-900">
                <div>Loading...</div>
            </div>
        );
    }

    return (
        <div>
            <MainNav />
            <div className="flex flex-col items-center justify-start min-h-screen py-8 bg-gray-900">
                <div className="container px-4 mx-auto">
                    <div className="grid gap-8 lg:grid-cols-6">
                        <div className="lg:col-span-2">
                            <img
                                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image+Available'}
                                alt={movie.title}
                                className="w-full h-auto rounded-md shadow-lg"
                            />
                        </div>
                        <div className="lg:col-span-4">
                            <h1 className="mb-4 text-4xl font-bold">{movie.title}</h1>
                            <div className="flex flex-wrap items-center mb-4 text-gray-400">
                                <span className="mr-4">Release Date: {movie.release_date}</span>
                                <span className="mr-4">Rating: {movie.vote_average}</span>
                                <span>Runtime: {movie.runtime} minutes</span>
                            </div>
                            <div className="mb-4 text-gray-400">
                                Genres: {movie.genres.map(genre => genre.name).join(', ')}
                            </div>
                            <div className="mb-4 text-gray-400">
                                Production Companies: {movie.production_companies.map(company => company.name).join(', ')}
                            </div>
                            <p className="mb-4">{movie.overview}</p>
                            {trailer && (
                                <div className="mt-4 mb-8">
                                    <h2 className="mb-2 text-lg font-semibold text-white">Trailer</h2>
                                    <button
                                        onClick={openModal}
                                        className="px-6 py-2 mb-4 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                                    >
                                        Watch Trailer
                                    </button>
                                    {showModal && (
                                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                            <div className="absolute inset-0 bg-black opacity-75"></div>
                                            <div className="relative z-10 w-full max-w-4xl bg-gray-900 rounded-md shadow-lg">
                                                <button
                                                    onClick={closeModal}
                                                    className="absolute text-white top-4 right-4 hover:text-gray-400"
                                                >
                                                    <MdClose size={24} />
                                                </button>
                                                <div className='w-full'>
                                                    <iframe
                                                        className="w-full h-[500px] lg:h-120"
                                                        src={`https://www.youtube.com/embed/${trailer.key}`}
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media"
                                                        allowFullScreen
                                                        title={movie.title}
                                                    ></iframe>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            {downloadLinks.length > 0 && (
                                <div className="mt-8">
                                    <h2 className="mb-3 text-lg font-semibold text-white">Download Links</h2>
                                    <ul className="space-y-2">
                                        {downloadLinks.map((torrent, index) => (
                                            <li key={index} className="flex items-center justify-between p-4 transition bg-gray-800 rounded-lg shadow hover:bg-gray-700">
                                                <div className="flex items-center">
                                                    <AiOutlineDownload className="w-5 h-5 mr-2 text-indigo-400" />
                                                    <span className="font-medium text-indigo-400">
                                                        {torrent.quality} - {torrent.size}
                                                    </span>
                                                </div>
                                                <a
                                                    href={torrent.url}
                                                    className="px-4 py-1 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-500"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Download
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-12 lg:grid lg:gap-10 lg:grid-cols-4 sm:flex sm:flex-col">
                        <div className="col-span-1 p-4 bg-gray-800 rounded-md">
                            <h2 className="mb-4 text-xl font-semibold text-white">Cast</h2>
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
                            <Link href={`/movies/${id}/cast`} className="block mt-4 text-indigo-400 hover:underline">View Full Cast</Link>
                        </div>
                        {similarMovies.length > 0 && (
                            <div className="col-span-3 mt-10 sm:mt-10 md:mt-10 lg:mt-0">
                                <h2 className="mb-5 text-lg font-semibold text-white">Similar Movies</h2>
                                <Slider {...sliderSettings}>
                                    {similarMovies.map(similarMovie => (
                                        <Link key={similarMovie.id} href={`/movies/${similarMovie.id}`}>
                                            <div className="cursor-pointer">
                                                {similarMovie.poster_path ? (
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w300${similarMovie.poster_path}`}
                                                        alt={similarMovie.title}
                                                        className="w-48 h-auto mx-auto rounded-md"
                                                    />
                                                ) : (
                                                    <img
                                                        src="https://eticketsolutions.com/demo/themes/e-ticket/img/movie.jpg"
                                                        alt="No Poster Available"
                                                        className="w-48 h-auto mx-auto rounded-md"
                                                    />
                                                )}
                                                <p className="mt-2 text-sm text-center text-gray-400">{similarMovie.title}</p>
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

export default MovieDetailsPage;
