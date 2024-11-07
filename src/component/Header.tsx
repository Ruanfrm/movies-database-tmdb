import { useEffect, useState } from 'react';
import axios from 'axios';
import { useApiUrl } from '../hooks/useApiUrl';
import { ApiUrlModal } from './ApiUrlModal';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../components/ui/select';
import { ModeToggle } from './mode-toggle';
import { toast } from 'sonner';
import { Edit } from 'lucide-react'; // Importando ícones do lucide-react
import { Button } from '@/components/ui/button'; // Importando o componente de botão do shadcn

export function Header() {
  const [systemName, setSystemName] = useState<Record<string, any> | null>(null);
  const [intervalTime, setIntervalTime] = useState<number>(() => parseInt(localStorage.getItem('updateInterval') || '5000'));
  const { apiUrl, setApiUrl } = useApiUrl();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(!apiUrl); // Exibe o modal se não houver URL configurada

  useEffect(() => {
    if (!apiUrl) return;

    const fetchSystemName = async () => {
      try {
        const response = await axios.get(`${apiUrl}/system-name`);
        setSystemName(response.data);
      } catch (error) {
        console.error('Erro ao buscar dados de Nome do Mikrotik:', error);
        toast.error('Erro ao buscar dados da API. Verifique a URL.');
      }
    };

    fetchSystemName();
  }, [apiUrl]);

  const handleIntervalChange = (value: string) => {
    const newInterval = parseInt(value);
    setIntervalTime(newInterval);
    localStorage.setItem('updateInterval', newInterval.toString());
    toast.success("Intervalo de tempo alterado com sucesso!");
  };

  return (
    <header className="p-4 border-b border-gray-200 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Monitor Mikrotik</h1>
        {systemName && (
          <h4 className="text-sm text-gray-500 dark:text-gray-400">{systemName.name}</h4>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900"
        >
          <Edit className="w-4 h-4" /> {/* Ícone de edição */}
          Editar URL da API
        </Button>

        <Select onValueChange={handleIntervalChange}>
          <SelectTrigger className="ml-2 w-full max-w-xs">
            <SelectValue placeholder={`Atualização: ${intervalTime / 1000} seg`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5000">5 segundos</SelectItem>
            <SelectItem value="10000">10 segundos</SelectItem>
            <SelectItem value="30000">30 segundos</SelectItem>
            <SelectItem value="60000">1 minuto</SelectItem>
          </SelectContent>
        </Select>
        <ApiUrlModal
        isOpen={isModalOpen}
        onSave={(newUrl) => {
          setApiUrl(newUrl);
          toast.success("URL da API alterada com sucesso!");
        }}
        onClose={() => setIsModalOpen(false)}
      />
      </div>

        <ModeToggle />
     
    </header>
  );
}
