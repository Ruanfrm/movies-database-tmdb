import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdDelete, MdArrowBack, MdError } from 'react-icons/md';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [selectedMovieName, setSelectedMovieName] = useState("");
  const [selectedMovieGenre, setSelectedMovieGenre] = useState("");

  useEffect(() => {
    const favoritesFromStorage = JSON.parse(localStorage.getItem('favorites')) || {};
    setFavorites(Object.entries(favoritesFromStorage));
  }, []);

  const handleRemoveFavorite = (movieId, movieName, movieGenre) => {
    setSelectedMovieId(movieId);
    setSelectedMovieName(movieName);
    setSelectedMovieGenre(movieGenre);
    setModalIsOpen(true);
  };

  const confirmRemoveFavorite = () => {
    const updatedFavorites = { ...JSON.parse(localStorage.getItem('favorites')) };
    delete updatedFavorites[selectedMovieId];
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setFavorites(Object.entries(updatedFavorites));
    setModalIsOpen(false);
  };

  return (
    <div className="dark container mx-auto">
      <nav className="bg-gray-800 p-4">
        <div className=" flex items-center"><MdArrowBack className='mr-2' size={25} />
          <Link to="/" className="text-white font-bold text-xl"> Voltar para a lista de filmes</Link>
        </div>
      </nav>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mt-8 mb-4 text-white">Meus Favoritos</h1>
        {favorites.length === 0 ? (
            <div className='flex items-center justify-center'>     <MdError className='mr-2' size={30}/><p className="text-gray-300 text-center text-xl">  Nenhum item favorito salvo!</p>
            </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Gênero</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-gray-900 divide-y divide-gray-700">
              {favorites.map(([movieId, movieData]) => (
                <tr key={movieId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 underline"><Link to={`/movie/${movieId}`}>{movieId}</Link></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{movieData.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{movieData.genre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleRemoveFavorite(movieId, movieData.name, movieData.genre)} className="text-red-500 hover:text-red-700"><MdDelete size={20}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Remover dos Favoritos"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2 text-white">Remover dos Favoritos</h2>
          <p className="text-gray-300">Tem certeza que deseja remover este filme dos favoritos?</p>
          <div className="flex justify-end mt-4">
            <button onClick={() => setModalIsOpen(false)} className="mr-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Cancelar</button>
            <button onClick={confirmRemoveFavorite} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Confirmar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default FavoritesPage;
