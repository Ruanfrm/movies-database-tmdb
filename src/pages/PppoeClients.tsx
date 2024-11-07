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

export function PppoeClients() {
  const [pppoeClients, setPppoeClients] = useState<any[]>([]);
  const [intervalTime, setIntervalTime] = useState<number>(() => {
    return parseInt(localStorage.getItem('updateInterval') || '5000');
  });

  useEffect(() => {
    const apiUrl = getApiUrl();
    if (!apiUrl) return; // Impede a execução caso a URL esteja ausentess
    const fetchPppoeClients = () => {
      axios.get(`${apiUrl}/pppoe-clients`)
        .then((response) => {
          console.log("Dados recebidos dos clientes PPPoE:", response.data);
          setPppoeClients(response.data);
        })
        .catch((error) => console.error("Erro ao buscar clientes PPPoE:", error));
    };

    fetchPppoeClients();
    const intervalId = setInterval(fetchPppoeClients, intervalTime);


   return () => clearInterval(intervalId);
  }, [intervalTime]);

  
  const handleIntervalChange = (value: string) => {
    const newInterval = parseInt(value);
    setIntervalTime(newInterval);
    localStorage.setItem('updateInterval', newInterval.toString());
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Clientes PPPoE</h2>

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
        <TableCaption>Lista de Clientes PPPoE</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nome de Usuário</TableHead>
            <TableHead>Endereço IP</TableHead>
            <TableHead>Endereço MAC</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pppoeClients.length > 0 ? (
            pppoeClients.map((client, index) => (
              <TableRow key={index}>
                <TableCell>{client.username}</TableCell>
                <TableCell>{client.ipAddress}</TableCell>
                <TableCell>{client.macAddress}</TableCell>
                <TableCell>{client.status}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Nenhum cliente PPPoE encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
