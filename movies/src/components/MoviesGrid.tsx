import React from 'react';

interface MoviesGridProps {
  data: any[];
  onItemClick: (id: string, type: "movie" | "tv") => void; // Definindo a tipagem da função
}

const MoviesGrid: React.FC<MoviesGridProps> = ({ data, onItemClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {data.map((item) => (
        <div
          key={item.id}
          className="cursor-pointer"
          onClick={() => onItemClick(item.id.toString(), item.media_type)} // "media_type" pode ser "movie" ou "tv"
        >
          <img
            src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'imagem-padrao.jpg'}
            alt={item.title || item.name}
            className="w-full h-80 object-cover rounded-lg"
          />
          <h3 className="mt-2 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
            {item.title || item.name}
          </h3>
        </div>
      ))}
    </div>
  );
};

export default MoviesGrid;
