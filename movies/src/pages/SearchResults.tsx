// SearchResults.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import MoviesGrid from '../components/MoviesGrid';

const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query') || '';
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate(); // Hook para navegação programática

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await api.get('search/multi', { params: { query } });
        setResults(response.data.results);
      } catch (error) {
        console.error('Erro ao buscar resultados:', error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  const handleItemClick = (id: string, type: string) => {
    // Navega para a página de detalhes
    navigate(`/details/${type}/${id}/`);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Resultados da busca para: "{query}"</h2>
      {loading ? (
        <div>Carregando...</div>
      ) : (
        <>
          {results.length === 0 ? (
            <div>Nenhum resultado encontrado para "{query}"</div>
          ) : (
            <MoviesGrid
              data={results}
              onItemClick={handleItemClick} // Passa a função onItemClick
            />
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
