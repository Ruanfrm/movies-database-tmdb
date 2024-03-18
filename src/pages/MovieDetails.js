import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Rating from "react-rating-stars-component";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import { MdLanguage, MdAttachMoney, MdStar } from "react-icons/md";
import { IoMdClock } from "react-icons/io";

import { AiOutlineCalendar, AiFillHeart } from "react-icons/ai";

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = process.env.REACT_APP_BASE_URL;
const POSTER_BASE_URL = process.env.REACT_APP_POSTER_BASE_URL;

function MovieDetails() {
  const [movieDetails, setMovieDetails] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    showMovieDetails(id);
    checkFavorite(id);
  }, [id]);

  const showMovieDetails = async (movieId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
      );
      const movie = await response.json();
      setMovieDetails(movie);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  const checkFavorite = (movieId) => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || {};
    setIsFavorite(!!favorites[movieId]);
  };

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || {};
    console.log("favorites before:", favorites);
    if (favorites[id]) {
      delete favorites[id];
    } else {
      favorites[id] = {
        name: movieDetails.title,
        genre: movieDetails.genres.map(genre => genre.name).join(', ')
      };
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    setIsFavorite(!isFavorite);
    console.log("favorites after:", favorites);
    console.log("isFavorite:", isFavorite);
  };
  const formatCurrency = (amount) => {
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const displayGenres = () => {
    if (!movieDetails || !movieDetails.genres) return null;

    return movieDetails.genres.map((genre) => (
      <span key={genre.id} className="mr-2">
        {genre.name}
      </span>
    ));
  };

  const displayProductionCompanies = () => {
    if (!movieDetails || !movieDetails.production_companies) return null;

    return movieDetails.production_companies.map((company) => (
      <span key={company.id} className="mr-2">
        {company.name}
      </span>
    ));
  };

  return (
    <div>
      {movieDetails && (
        <div id="movieDetails" className="p-4 container mx-auto">
          <h2 className="text-2xl font-bold  text-center">
            {movieDetails.title}
          </h2>
          <span className="flex justify-end">
            {" "}
            {isFavorite ? (
              <MdFavorite
                className="mr-2  "
                size={30}
                onClick={toggleFavorite}
              />
            ) : (
              <MdFavoriteBorder
                className="mr-2"
                size={30}
                onClick={toggleFavorite}
              />
            )}
          </span>
          <img
            src={`${POSTER_BASE_URL}${movieDetails.backdrop_path}`}
            alt={movieDetails.title}
            className="w-full max-w-xl mx-auto rounded-lg shadow-lg mb-2"
          />

          <p>{movieDetails.overview}</p>
          <div className="flex mt-2">
            <div className="w-1/2 ">
              <div className="flex items-center">
                <MdLanguage className="mr-2" />
                <p>
                  <strong>Language:</strong> {movieDetails.original_language}
                </p>
              </div>
              <div className="flex items-center">
                <AiOutlineCalendar className="mr-2" />
                <p>
                  <strong> Release Date:</strong>{" "}
                  {new Date(movieDetails.release_date).toLocaleDateString(
                    "pt-BR"
                  )}
                </p>
              </div>

              <div className="flex items-center">
                <p>
                  <strong>Genres:</strong> {displayGenres()}
                </p>
              </div>
              <div className="flex items-center">
                <p>
                  <strong>Production Companies:</strong>{" "}
                  {displayProductionCompanies()}
                </p>
              </div>

              <div className="flex items-center">
                <MdAttachMoney className="mr-2" />
                <p>
                  <strong>Budget:</strong> {formatCurrency(movieDetails.budget)}
                </p>
              </div>
              <div className="flex items-center">
                <MdAttachMoney className="mr-2" />
                <p>
                  <strong>Revenue:</strong>{" "}
                  {formatCurrency(movieDetails.revenue)}
                </p>
              </div>

              <div className="flex items-center">
                <MdStar className="mr-2" />
                <p>
                  <strong>Popularity:</strong> {movieDetails.popularity}
                </p>
              </div>
            </div>
            <div className="w-1/2">
              <div className="flex items-center">
                <MdStar className="mr-2" />
                <strong className="mr-2">Rating:</strong>
                <p>
                  <Rating
                    count={5}
                    value={movieDetails.vote_average / 2}
                    size={24}
                    edit={false}
                    activeColor="#ffd700"
                  />
                </p>
              </div>
              <div className="flex items-center">
                <IoMdClock className="mr-2" />
                <p>
                  <strong>Runtime:</strong> {movieDetails.runtime} mins
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-center mt-4">
        <button
          onClick={toggleFavorite}
          className=" text-white font-bold py-2 px-4 rounded flex items-center"
        >
          {isFavorite ? (
            <MdFavorite className="mr-2  " size={20} />
          ) : (
            <MdFavoriteBorder className="mr-2" size={20} />
          )}
        </button>
        <button
          onClick={toggleFavorite}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </button>
        <Link
          to="/"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold ml-2 py-2 px-4 rounded"
        >
          Back to List
        </Link>
      </div>
    </div>
  );
}

export default MovieDetails;
