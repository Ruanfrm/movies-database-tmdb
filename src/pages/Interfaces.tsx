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

      <Table className="border ">
        <TableCaption className="text-gray-500 dark:text-gray-400">Lista de Interfaces</TableCaption>
        <TableHeader>
          <TableRow className="">
            <TableHead className="text-gray-700 dark:text-gray-300">Nome</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">MAC Address</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">MTU</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Tráfego (Recebido / Enviado)</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Última Conexão</TableHead>
            <TableHead className="text-gray-700 dark:text-gray-300">Quedas de Conexão</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interfaces.length > 0 ? (
            interfaces.map((iface, index) => (
              <TableRow key={index} className={`${iface.running === "true" ? "bg-green-50 dark:bg-green-900" : "bg-red-50 dark:bg-red-900"}`}>
                <TableCell className="text-gray-800 dark:text-gray-300">{iface.name}</TableCell>
                <TableCell className="text-gray-800 dark:text-gray-300">{iface['mac-address']}</TableCell>
                <TableCell className="text-gray-800 dark:text-gray-300">{iface.mtu}</TableCell>
                <TableCell className="text-gray-800 dark:text-gray-300">
                  {formatBytes(parseInt(iface['rx-byte']))} / {formatBytes(parseInt(iface['tx-byte']))}
                </TableCell>
                <TableCell className={iface.running === "true" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                  {iface.running === "true" ? "Ativa" : "Inativa"}
                </TableCell>
                <TableCell className="text-gray-800 dark:text-gray-300">{iface['last-link-up-time']}</TableCell>
                <TableCell className="text-gray-800 dark:text-gray-300">{iface['link-downs']}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-gray-800 dark:text-gray-300">
                Nenhuma interface encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
