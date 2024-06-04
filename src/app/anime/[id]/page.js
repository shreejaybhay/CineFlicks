"use client"
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import MainNav from '@/components/MainNavbar';

const AnimeDetailsPage = () => {
    const [anime, setAnime] = useState(null);
    const [id, setId] = useState(null);

    useEffect(() => {
        // Extract anime ID from the URL
        const pathParts = window.location.pathname.split('/');
        const animeId = pathParts[pathParts.length - 1];
        setId(animeId);

        const fetchAnimeDetails = async () => {
            try {
                if (!id) return;

                const query = `
                    query ($id: Int) {
                        Media(id: $id, type: ANIME) {
                            id
                            title {
                                romaji
                                english
                                native
                            }
                            description
                            episodes
                            status
                            season
                            seasonYear
                            coverImage {
                                large
                            }
                            genres
                        }
                    }
                `;

                const variables = {
                    id: parseInt(id)
                };

                const response = await fetch('https://graphql.anilist.co', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        query,
                        variables
                    })
                });

                const data = await response.json();

                if (data.errors) {
                    throw new Error('Failed to fetch anime details');
                }

                setAnime(data.data.Media);
            } catch (error) {
                console.error('Error fetching anime details:', error);
            }
        };

        fetchAnimeDetails();
    }, [id]);

    if (!anime) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <div>Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
        <MainNav />
        <div className="container px-4 py-8 mx-auto">
            <div className="grid max-w-5xl grid-cols-1 gap-8 mx-auto md:grid-cols-2">
                <div>
                    <img src={anime.coverImage.large} alt={anime.title.romaji} className="w-full rounded-md" />
                </div>
                <div className="text-white">
                    <h1 className="text-3xl font-bold">{anime.title.romaji}</h1>
                    <p className="mt-2 text-gray-400">{anime.description}</p>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <p className="text-gray-400"><span className="font-semibold">Episodes:</span> {anime.episodes}</p>
                            <p className="text-gray-400"><span className="font-semibold">Status:</span> {anime.status}</p>
                        </div>
                        <div>
                            <p className="text-gray-400"><span className="font-semibold">Season:</span> {anime.season}</p>
                            <p className="text-gray-400"><span className="font-semibold">Year:</span> {anime.seasonYear}</p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-gray-400"><span className="font-semibold">Genres:</span> {anime.genres.join(', ')}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    );
};

export default AnimeDetailsPage;
