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
                const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=97c1ec10f492d5880ccb5f65506d37e0`);
                if (!response.ok) {
                    throw new Error('Failed to fetch movie details');
                }
                const data = await response.json();
                setMovie(data);

                const trailerResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=97c1ec10f492d5880ccb5f65506d37e0`);
                if (!trailerResponse.ok) {
                    throw new Error('Failed to fetch trailer');
                }
                const trailerData = await trailerResponse.json();
                const trailer = trailerData.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
                setTrailer(trailer);

                const ytsResponse = await fetch(`https://yts.mx/api/v2/list_movies.json?query_term=${encodeURIComponent(data.title)}`);
                if (!ytsResponse.ok) {
                    throw new Error('Failed to fetch download links');
                }
                const ytsData = await ytsResponse.json();
                if (ytsData.data.movie_count > 0) {
                    setDownloadLinks(ytsData.data.movies[0].torrents);
                }

                const similarResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/similar?api_key=97c1ec10f492d5880ccb5f65506d37e0`);
                if (!similarResponse.ok) {
                    throw new Error('Failed to fetch similar movies');
                }
                const similarData = await similarResponse.json();
                setSimilarMovies(similarData.results);

                const castResponse = await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=97c1ec10f492d5880ccb5f65506d37e0`);
                if (!castResponse.ok) {
                    throw new Error('Failed to fetch cast');
                }
                const castData = await castResponse.json();
                setCast(castData.cast);
            } catch (error) {
                console.error('Error fetching movie details:', error);
            }
        };

        fetchMovieDetails();
    }, [id]);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    if (!movie) {
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
            <div className="flex items-start justify-center min-h-screen bg-gray-900">
                <div className="container px-4 mx-auto mt-8">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-6">
                        <div className="col-span-1">
                            <img src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image+Available'} alt={movie.title} className="w-full h-auto rounded-md" />
                            <div className="p-4 mt-8 bg-gray-800 rounded-md">
                                <h2 className="mb-4 text-xl font-semibold text-white">Cast</h2>
                                <ul className="space-y-2">
                                    {cast.slice(0, 5).map((actor, index) => (
                                        <li key={index} className="flex items-center">
                                            <img src={`https://image.tmdb.org/t/p/w45${actor.profile_path}`} alt={actor.name} className="object-cover w-10 h-10 mr-3 rounded-full" />
                                            <span className="text-white">{actor.name}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Link href={`/movies/${id}/cast`} className="block mt-4 text-indigo-400 hover:underline">View Full Cast</Link>
                            </div>
                        </div>
                        <div className="col-span-5 text-white">
                            <h1 className="mb-4 text-4xl font-bold">{movie.title}</h1>
                            <p className="mb-2 text-gray-400">Release Date: {movie.release_date}</p>
                            <p className="mb-2 text-gray-400">Rating: {movie.vote_average}</p>
                            <p className="mb-2 text-gray-400">Runtime: {movie.runtime} minutes</p>
                            <p className="mb-2 text-gray-400">Genres: {movie.genres.map(genre => genre.name).join(', ')}</p>
                            <p className="mb-2 text-gray-400">Production Companies: {movie.production_companies.map(company => company.name).join(', ')}</p>
                            <p className="mt-4 mb-4">{movie.overview}</p>
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
                                                <div className="p-8">
                                                    <iframe
                                                        className='w-full h-96'
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
                            {similarMovies.length > 0 && (
                                <div className="mt-12">
                                    <h2 className="mb-5 text-lg font-semibold text-white">Similar Movies</h2>
                                    <Slider {...settings}>
                                        {similarMovies.map(similarMovie => (
                                            <Link key={similarMovie.id} href={`/movies/${similarMovie.id}`}>
                                                <div className="cursor-pointer">
                                                    {similarMovie.poster_path ? (
                                                        <img
                                                            src={`https://image.tmdb.org/t/p/w300${similarMovie.poster_path}`}
                                                            alt={similarMovie.name}
                                                            className="w-48 h-auto rounded-md"
                                                        />
                                                    ) : (
                                                        <img
                                                            src="https://eticketsolutions.com/demo/themes/e-ticket/img/movie.jpg"
                                                            alt="No Poster Available"
                                                            className="w-48 h-auto rounded-md"
                                                        />
                                                    )}
                                                    <p className="mt-2 text-sm text-gray-400">{similarMovie.title}</p>
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
        </div>
    );
};

export default MovieDetailsPage;
