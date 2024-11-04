import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useDebounce } from 'use-debounce';

const LogsComponent = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedTopic, setSelectedTopic] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/mikrotik-logs`);
      if (!response.ok) throw new Error('Falha ao buscar logs. Tente novamente mais tarde.');

      const data = await response.json();
      setLogs(data.reverse()); // Carregar logs com o mais recente primeiro
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    const filtered = logs
      .filter(log =>
        debouncedSearchTerm
          ? log.message.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
          : true
      )
      .filter(log =>
        selectedTopic ? log.topics.toLowerCase() === selectedTopic.toLowerCase() : true
      )
      .sort((a, b) => {
        return sortOrder === 'newest'
          ? new Date(b.time).getTime() - new Date(a.time).getTime()
          : new Date(a.time).getTime() - new Date(b.time).getTime();
      });

    setFilteredLogs(filtered);
  }, [debouncedSearchTerm, logs, sortOrder, selectedTopic]);

  const currentLogs = filteredLogs.slice(
    (currentPage - 1) * logsPerPage,
    currentPage * logsPerPage
  );

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const handleTopicChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTopic(event.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="p-6 shadow-md rounded-lg">
      <h2 className="text-lg font-bold mb-4">Logs do MikroTik</h2>

      <div className="mb-4 flex items-center gap-2">
        <Input
          placeholder="Buscar logs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mr-2"
        />

        {/* <select
          onChange={handleTopicChange}
          value={selectedTopic}
          className="p-2 border rounded-md"
        >
          <option value="">Todos os tipos</option>
          <option value="error">Erro</option>
          <option value="info">Info</option>
          <option value="warning">Aviso</option>
        </select> */}

        <select
          onChange={(e) => setSortOrder(e.target.value)}
          value={sortOrder}
          className="p-2 border rounded-md dark:text-zinc-900"
          
        >
          <option value="newest">Mais recentes</option>
          <option value="oldest">Mais antigos</option>
        </select>

        <Button onClick={fetchLogs} disabled={loading} className="flex items-center gap-2">
          <ReloadIcon /> {loading ? 'Atualizando...' : 'Atualizar'}
        </Button>
      </div>

      {loading && <p className="text-gray-500">Carregando logs...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-2">
        {currentLogs.map((log) => (
          <div key={log.id} className="p-4 border rounded-md hover:bg-gray-50 dark:hover:bg-zinc-900">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{log.time}</span>
              <span className="text-sm text-gray-500">{log.topics}</span>
            </div>
            <p className="mt-1">{log.message}</p>
          </div>
        ))}
        {currentLogs.length === 0 && !loading && <p>Nenhum log encontrado.</p>}
      </div>

      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>
        <p>
          Página {currentPage} de {totalPages}
        </p>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
};

export default LogsComponent;
