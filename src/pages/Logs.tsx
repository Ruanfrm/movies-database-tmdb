import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input'; // Supondo que você tenha um componente Input estilizado
import { Button } from '@/components/ui/button'; // Supondo que você tenha um componente Button estilizado
import { ReloadIcon } from '@radix-ui/react-icons'; // Importando ícones do Radix UI
import { useDebounce } from 'use-debounce'; // Para debouncing da busca

const LogsComponent = () => {
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Função para buscar logs na API
    const fetchLogs = async () => {
        setLoading(true); // Iniciar o carregamento
        setError(null); // Limpar erros anteriores
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/mikrotik-logs`);
            if (!response.ok) {
                throw new Error('Falha ao buscar logs. Tente novamente mais tarde.');
            }
            const data = await response.json();
            // Inverte a ordem dos logs para que o mais recente apareça primeiro
            setLogs(data.reverse());
        } catch (error) {
            setError(error.message); // Armazenar mensagem de erro
        } finally {
            setLoading(false); // Finalizar o carregamento
        }
    };

    // Efeito para buscar logs ao montar o componente
    useEffect(() => {
        fetchLogs();
    }, []);

    // Efeito para filtrar logs com base no termo de busca
    useEffect(() => {
        const newFilteredLogs = debouncedSearchTerm
            ? logs.filter(log =>
                log.message.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            )
            : logs;

        setFilteredLogs(newFilteredLogs);
    }, [debouncedSearchTerm, logs]);

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-lg font-bold mb-4">Logs do MikroTik</h2>
            <div className="mb-4 flex">
                <Input
                    placeholder="Buscar logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mr-2"
                />
                <Button onClick={fetchLogs} disabled={loading}>
                    <ReloadIcon /> Atualizar
                </Button>
            </div>
            {loading && <p className="text-gray-500">Carregando logs...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <div className="space-y-2">
                {filteredLogs.map(log => (
                    <div key={log.id} className="p-4 border rounded-md bg-gray-50 hover:bg-gray-100 transition duration-200">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">{log.time}</span>
                            <span className="text-sm text-gray-500">{log.topics}</span>
                        </div>
                        <p className="mt-1">{log.message}</p>
                    </div>
                ))}
                {filteredLogs.length === 0 && !loading && <p>Nenhum log encontrado.</p>}
            </div>
        </div>
    );
};

export default LogsComponent;
