import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '../components/ui/table';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '../components/ui/select';

export function DhcpClients() {
  const [dhcpClients, setDhcpClients] = useState<Record<string, any>[]>([]);
  const [intervalTime, setIntervalTime] = useState<number>(() => {
    return parseInt(localStorage.getItem('updateInterval') || '5000');
  });
  const [loading, setLoading] = useState<boolean>(true); // Estado de carregamento

  useEffect(() => {
    const fetchDhcpClients = async () => {
      setLoading(true); // Inicia o carregamento
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/dhcp-clients`);
        console.log("Dados recebidos dos clientes DHCP:", response.data);
        setDhcpClients(response.data || []); // Garante que seja um array
      } catch (error) {
        console.error("Erro ao buscar clientes DHCP:", error);
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    fetchDhcpClients();
    const intervalId = setInterval(fetchDhcpClients, intervalTime);

    return () => clearInterval(intervalId);
  }, [intervalTime]);

  const handleIntervalChange = (value: string) => {
    const newInterval = parseInt(value);
    setIntervalTime(newInterval);
    localStorage.setItem('updateInterval', newInterval.toString());
  };

  if (loading) {
    return <p>Carregando clientes DHCP...</p>; // Mensagem de carregamento
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Clientes DHCP</h2>
      
      <label className="block mb-4">
        Atualizar a cada:
        <Select onValueChange={handleIntervalChange}>
          <SelectTrigger className="ml-2 w-full max-w-xs">
            <SelectValue placeholder={`${intervalTime / 1000} segundos`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5000">5 segundos</SelectItem>
            <SelectItem value="10000">10 segundos</SelectItem>
            <SelectItem value="30000">30 segundos</SelectItem>
            <SelectItem value="60000">1 minuto</SelectItem>
          </SelectContent>
        </Select>
      </label>

      <Table>
        <TableCaption>Lista de Clientes DHCP</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nome do Host</TableHead>
            <TableHead>Endereço IP</TableHead>
            <TableHead>Endereço MAC</TableHead>
            <TableHead>Tempo de Locação</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dhcpClients.length > 0 ? (
            dhcpClients.map((client, index) => (
              <TableRow key={index}>
                <TableCell>{client['host-name']}</TableCell>
                <TableCell>{client.address}</TableCell>
                <TableCell>{client['client-id']}</TableCell>
                <TableCell>{client['last-seen']}</TableCell>
                <TableCell>{client.status}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Nenhum cliente DHCP encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
