import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { SunIcon, MoonIcon } from '@radix-ui/react-icons'; // Importando ícones do Radix UI
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '../components/ui/select';
import { useTheme } from '../context/ThemeContext';
import { ModeToggle } from './mode-toggle';
import { toast } from 'sonner';

export function Header() {
  const { theme, toggleTheme } = useTheme();
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
        console.error('Erro ao buscar dados de Nome do Mikrotik:', error);
      }
    };

    fetchSystemName();
  }, []);

  const handleIntervalChange = (value: string) => {
    const newInterval = parseInt(value);
    setIntervalTime(newInterval);
    localStorage.setItem('updateInterval', newInterval.toString());
    toast("Intervalo de tempo alterado com sucesso!")
  };

  return (
    <header className="p-4 border-b border-gray-200 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Monitor Mikrotik</h1>
        {systemName && (
          <h4 className="text-sm text-gray-500 dark:text-gray-400">{systemName.name}</h4>
        )}
      </div>

      <label className="flex items-center gap-4">
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
      </label>

   
      <ModeToggle/>
    </header>
  );
}
