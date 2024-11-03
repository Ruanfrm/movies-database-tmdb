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
} from '../components/ui/table'; // Verifique o caminho correto

export function Interfaces() {
  const [interfaces, setInterfaces] = useState<any[]>([]);

  useEffect(() => {
    const fetchInterfaces = () => {
      axios.get(`${import.meta.env.VITE_API_URL}/interfaces`)
        .then((response) => {
          console.log("Dados recebidos das interfaces:", response.data);
          setInterfaces(response.data);
        })
        .catch((error) => console.error("Erro ao buscar interfaces:", error));
    };

    fetchInterfaces();
  }, []);

  // Função para converter bytes em um formato mais legível
  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    const units = ['KB', 'MB', 'GB', 'TB'];
    let i = -1;
    do {
      bytes /= 1024;
      i++;
    } while (bytes >= 1024 && i < units.length - 1);
    return `${bytes.toFixed(1)} ${units[i]}`;
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Interfaces</h2>

      <Table>
        <TableCaption>Lista de Interfaces</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>MAC Address</TableHead>
            <TableHead>MTU</TableHead>
            <TableHead>Tráfego (Recebido / Enviado)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Última Conexão</TableHead>
            <TableHead>Quedas de Conexão</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interfaces.length > 0 ? (
            interfaces.map((iface, index) => (
              <TableRow key={index} className={iface.running === "true" ? "bg-green-50" : "bg-red-50"}>
                <TableCell>{iface.name}</TableCell>
                <TableCell>{iface['mac-address']}</TableCell>
                <TableCell>{iface.mtu}</TableCell>
                <TableCell>
                  {formatBytes(parseInt(iface['rx-byte']))} / {formatBytes(parseInt(iface['tx-byte']))}
                </TableCell>
                <TableCell className={iface.running === "true" ? "text-green-600" : "text-red-600"}>
                  {iface.running === "true" ? "Ativa" : "Inativa"}
                </TableCell>
                <TableCell>{iface['last-link-up-time']}</TableCell>
                <TableCell>{iface['link-downs']}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Nenhuma interface encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
