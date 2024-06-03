/* eslint-disable @next/next/no-img-element */
import React from 'react';

const Favorites = ({ favorites }) => {
    return (
        <div>
            <h1>Favorites</h1>
            <h2>Movies</h2>
            <div>
                {favorites.map(movie => (
                    <div key={movie.id}>
                        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                        <h3>{movie.title}</h3>
                        <p>Release Date: {movie.release_date}</p>
                        <p>Rating: {movie.vote_average}</p>
                        <p>{movie.overview}</p>
                    </div>
                ))}
            </div>
            <h2>TV Shows</h2>
            {/* Display favorite TV shows here */}
        </div>
    );
};

export default Favorites;
