// components/MovieCard.js
import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  return (
    <div className="movie-card bg-gray-800 rounded-lg overflow-hidden shadow-lg text-gray-100 mb-4">
      <Link to={`/movie/${movie.id}`}>
        <div className="relative">
          <img src={`${POSTER_BASE_URL}${movie.poster_path}`} alt={movie.title} className="w-full h-64 object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-75 p-2">
            <h3 className="font-bold text-lg">{movie.title}</h3>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <p>Release Date: {new Date(movie.release_date).toLocaleDateString('pt-BR')}</p>
        <button className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded" onClick={() => isFavorite(movie.id) ? removeFromFavorites(movie.id) : addToFavorites(movie.id)}>
          {updateFavoriteButton(movie.id)}
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
