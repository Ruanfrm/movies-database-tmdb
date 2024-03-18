import React, { useState, useEffect } from 'react';
import { IoMdEye } from 'react-icons/io';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination'; // Importando o componente de paginação
import APIKey from "../ApiKey"

const API_KEY = APIKey.key;
const BASE_URL = APIKey.base_url;
const POSTER_BASE_URL = APIKey.poster_base_url;

function MovieList() {
  const [searchInput, setSearchInput] = useState('');
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    getPopularMovies();
  }, [currentPage]); // Adicionando currentPage como dependência para recarregar a lista ao mudar de página

  const searchMovies = async () => {
    if (!searchInput.trim()) return;

    try {
      const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${searchInput}&language=pt-BR`);
      const data = await response.json();
      setMovies(data.results);
      setTotalPages(data.total_pages); // Atualizando o total de páginas com base na resposta da API
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  const getPopularMovies = async () => {
    try {
      const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${currentPage}&language=pt-BR`);
      const data = await response.json();
      setMovies(data.results);
      setTotalPages(data.total_pages); // Atualizando o total de páginas com base na resposta da API
    } catch (error) {
      console.error('Error fetching popular movies:', error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber); // Atualizando a página atual ao clicar em um número de página
  };

  const displayMovies = (movies) => {
    return movies.map(movie => (
      <div key={movie.id} className="movie-card bg-gray-800 rounded-lg overflow-hidden shadow-lg text-gray-100 mb-4 container">
        <div className="relative">
          <img src={`${POSTER_BASE_URL}${movie.poster_path}`} alt={movie.title} className="w-full h-64 object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-75 p-2">
            <h3 className="font-bold text-lg">{movie.title}</h3>
          </div>
        </div>
        <div className="p-4">
          <p>Release Date: {new Date(movie.release_date).toLocaleDateString('pt-BR')}</p>
          <Link to={`/movie/${movie.id}`} className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-block">Details</Link>
        </div>
      </div>
    ));
  };

  return (
    <div className="container mx-auto bg-gray-900 min-h-screen text-white">
      <nav className='flex items-center justify-between'>
        <h1 className="text-3xl font-bold mb-4 mt-3">Movie Database</h1>
        <div className='flex items-center'>
          <IoMdEye className='mr-2' size={20}/>
          <Link to="/favorites" ><strong>Ver Favoritos</strong></Link>
        </div>
      </nav>
      <div className="flex mb-4">
        <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} className="w-full px-4 py-2 mr-2 rounded-md border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 bg-gray-800 text-gray-100" placeholder="Search for movies..." />
        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={searchMovies}>Search</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayMovies(movies)}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} /> {/* Incluindo o componente de paginação */}
    </div>
  );
}

export default MovieList;
