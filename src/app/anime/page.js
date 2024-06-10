/* eslint-disable @next/next/no-img-element */
"use client"
import React, { useState, useEffect } from 'react';
import MainNav from '@/components/mainnavbar';
import Link from 'next/link';
import { MdNavigateNext } from "react-icons/md";
import { GrFormPrevious } from "react-icons/gr";
import { BsFillMicFill } from 'react-icons/bs';

const TrendingAnimePage = () => {
  const [anime, setAnime] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState('');
  const genreKey = 'trending';
  const selectedGenreKey = 'selected_genre';

  useEffect(() => {
    const savedPage = parseInt(localStorage.getItem(`page_${genreKey}`), 10) || 1;
    setPage(savedPage);

    const savedGenre = localStorage.getItem(selectedGenreKey) || '';
    setSelectedGenre(savedGenre);
  }, []);

  useEffect(() => {
    const fetchAnime = async () => {
      let query = '';

      if (searchTerm) {
        query = `
          query ($search: String, $page: Int, $perPage: Int) {
            Page(page: $page, perPage: $perPage) {
              media(search: $search, type: ANIME) {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                averageScore
                description
              }
            }
          }
        `;
      } else if (selectedGenre) {
        query = `
          query ($page: Int, $perPage: Int, $genre: String) {
            Page(page: $page, perPage: $perPage) {
              media(genre: $genre, type: ANIME) {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                averageScore
                description
              }
            }
          }
        `;
      } else {
        query = `
          query ($page: Int, $perPage: Int) {
            Page(page: $page, perPage: $perPage) {
              media(sort: TRENDING_DESC, type: ANIME) {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                averageScore
                description
              }
            }
          }
        `;
      }

      const variables = {
        search: searchTerm,
        page: page,
        perPage: 20,
        genre: selectedGenre
      };

      const url = 'https://graphql.anilist.co';
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          query: query,
          variables: variables
        })
      };

      try {
        const response = await fetch(url, options);
        const data = await response.json();
        if (data.errors) {
          throw new Error(data.errors[0].message);
        }
        setAnime(data.data.Page.media);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        console.error('Error fetching anime:', error);
        setAnime([]);
      }
    };

    fetchAnime();
  }, [searchTerm, page, selectedGenre]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    localStorage.setItem(`page_${genreKey}`, newPage.toString());
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleGenreChange = (e) => {
    const genre = e.target.value;
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
    "Action", "Adventure", "Comedy", "Drama", "Ecchi", "Fantasy", "Horror",
    "Mahou Shoujo", "Mecha", "Music", "Mystery", "Psychological", "Romance",
    "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"
  ];

  return (
    <div>
      <MainNav />
      <div className="flex items-start justify-center min-h-screen bg-gray-900">
        <div className="container mx-auto mt-8">
          <div className="flex flex-col items-center justify-between mb-4 sm:flex-row">
            <h1 className="mb-4 text-3xl font-bold text-white sm:mb-0">Trending Anime</h1>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <input
                type="text"
                className="px-4 py-2 text-black border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
                placeholder="Search anime..."
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
                onChange={handleGenreChange}
              >
                <option value="">All Genres</option>
                {genres.map((genre, index) => (
                  <option key={index} value={genre}>{genre}</option>
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {anime.map(item => (
              <Link key={item.id} href={`/anime/${item.id}`}>
                <div className="flex flex-col h-full p-2 bg-gray-800 rounded-md shadow-md cursor-pointer">
                  <img src={item.coverImage.large} alt={item.title.romaji} className="w-full h-auto rounded-md" />
                  <div className="flex flex-col justify-between flex-grow mt-2">
                    <h2 className="text-sm font-semibold text-gray-200">{item.title.romaji} ({item.title.english})</h2>
                    <p className="text-xs text-gray-400">Rating: {item.averageScore}</p>
                    <p className="mt-1 text-xs text-gray-400 line-clamp-3">{item.description}</p>
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

export default TrendingAnimePage;
