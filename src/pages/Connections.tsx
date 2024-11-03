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

export function Connections() {
  const [connections, setConnections] = useState<any[]>([]);
  const [intervalTime, setIntervalTime] = useState<number>(() => {
    return parseInt(localStorage.getItem('updateInterval') || '5000');
  });

  useEffect(() => {
    const fetchConnections = () => {
      axios.get(`${import.meta.env.VITE_API_URL}/active-connections`)
        .then((response) => {
          console.log("Dados recebidos das conexões ativas:", response.data);
          const formattedData = response.data.map((conn: any) => ({
            id: conn[".id"],
            srcAddress: conn["src-address"],
            dstAddress: conn["dst-address"],
            protocol: conn.protocol,
            timeout: conn.timeout,
            origPackets: conn["orig-packets"],
            origBytes: conn["orig-bytes"]
          }));
          setConnections(formattedData);
        })
        .catch((error) => console.error("Erro ao buscar conexões ativas:", error));
    };

    fetchConnections();
    const intervalId = setInterval(fetchConnections, intervalTime);

    return () => clearInterval(intervalId);
  }, [intervalTime]);

  const handleIntervalChange = (value: string) => {
    const newInterval = parseInt(value);
    setIntervalTime(newInterval);
    localStorage.setItem('updateInterval', newInterval.toString());
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Conexões Ativas</h2>

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
        <TableCaption>Lista de conexões ativas</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Origem</TableHead>
            <TableHead>Destino</TableHead>
            <TableHead>Protocolo</TableHead>
            <TableHead>Timeout</TableHead>
            <TableHead>Pacotes Originais</TableHead>
            <TableHead>Bytes Originais</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {connections.length > 0 ? (
            connections.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.srcAddress}</TableCell>
                <TableCell>{row.dstAddress}</TableCell>
                <TableCell>{row.protocol}</TableCell>
                <TableCell>{row.timeout}</TableCell>
                <TableCell>{row.origPackets}</TableCell>
                <TableCell>{row.origBytes}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Nenhuma conexão ativa encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
