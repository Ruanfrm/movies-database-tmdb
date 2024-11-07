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
} from '../components/ui/table'; // Certifique-se de que o caminho está correto
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '../components/ui/select';
import { getApiUrl } from "../utils/apiConfig"; // Importa a função para obter a URL


export function HotspotClients() {
  const [hotspotClients, setHotspotClients] = useState<any[]>([]);
  const [intervalTime, setIntervalTime] = useState<number>(() => {
    return parseInt(localStorage.getItem('updateInterval') || '5000');
  });

  useEffect(() => {
    const apiUrl = getApiUrl();
    if (!apiUrl) return; // Impede a execução caso a URL esteja ausente

    const fetchHotspotClients = () => {
      axios.get(`${apiUrl}/hotspot-clients`)
        .then((response) => {
          console.log("Dados recebidos dos clientes Hotspot:", response.data);
          setHotspotClients(response.data);
        })
        .catch((error) => console.error("Erro ao buscar clientes Hotspot:", error));
    };

    fetchHotspotClients();
    const intervalId = setInterval(fetchHotspotClients, intervalTime);

    return () => clearInterval(intervalId);
  }, [intervalTime]);

  const handleIntervalChange = (value: string) => {
    const newInterval = parseInt(value);
    setIntervalTime(newInterval);
    localStorage.setItem('updateInterval', newInterval.toString());
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Clientes Hotspot</h2>

      <label className="block mb-4">
        Atualizar a cada:
        <Select onValueChange={handleIntervalChange}>
          <SelectTrigger className="ml-2 w-full max-w-xs">
            <SelectValue placeholder={`${intervalTime / 1000} segundos`} />
          </SelectTrigger>
          <SelectContent>
            {/* <SelectItem value="1000">1 segundo</SelectItem>
            <SelectItem value="3000">3 segundos</SelectItem> */}
            <SelectItem value="5000">5 segundos</SelectItem>
            <SelectItem value="10000">10 segundos</SelectItem>
            <SelectItem value="30000">30 segundos</SelectItem>
            <SelectItem value="60000">1 minuto</SelectItem>
          </SelectContent>
        </Select>
      </label>

      <Table>
        <TableCaption>Lista de Clientes Hotspot</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nome de Usuário</TableHead>
            <TableHead>Endereço IP</TableHead>
            <TableHead>Endereço MAC</TableHead>
            <TableHead>Duração da Sessão</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hotspotClients.length > 0 ? (
            hotspotClients.map((client, index) => (
              <TableRow key={index}>
                <TableCell>{client.username}</TableCell>
                <TableCell>{client.ipAddress}</TableCell>
                <TableCell>{client.macAddress}</TableCell>
                <TableCell>{client.sessionTime}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Nenhum cliente Hotspot encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
