import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '../components/ui/select';

export function Header() {
  const [systemName, setSystemName] = useState<Record<string, any> | null>(null);
  const [intervalTime, setIntervalTime] = useState<number>(() => {
    return parseInt(localStorage.getItem('updateInterval') || '5000');
  });

  useEffect(() => {
    const fetchSystemName = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/system-name`);
        setSystemName(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados de Nome do Mikrotik:", error);
      }
    };

    fetchSystemName();
  }, []);

  const handleIntervalChange = (value: string) => {
    const newInterval = parseInt(value);
    setIntervalTime(newInterval);
    localStorage.setItem('updateInterval', newInterval.toString());
  };

  return (
    <header className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
      <h1 className="text-2xl font-bold">Monitor Mikrotik</h1>
      
      {/* Verificando se systemName é válido antes de acessar a propriedade name */}
      {systemName && <h4 className="text-sm text-muted-foreground ">{systemName.name}</h4>}

      <label className="block mb-4">
        <Select onValueChange={handleIntervalChange}>
          <SelectTrigger className="ml-2 w-full max-w-xs">
            <SelectValue placeholder={`Tempo de atualização: ${intervalTime / 1000} segundos`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5000">5 segundos</SelectItem>
            <SelectItem value="10000">10 segundos</SelectItem>
            <SelectItem value="30000">30 segundos</SelectItem>
            <SelectItem value="60000">1 minuto</SelectItem>
          </SelectContent>
        </Select>
      </label>
      {/* <Button>Logout</Button> */}
    </header>
  );
}
