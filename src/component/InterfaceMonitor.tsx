// InterfaceMonitor.tsx

"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import InterfaceTrafficChart from "@/component/InterfaceTrafficChart"; // Ajuste o caminho conforme necessário

const InterfaceMonitor = () => {
  const [interfaces, setInterfaces] = useState<any[]>([]);
  const [selectedInterface, setSelectedInterface] = useState<string | null>(null);
  const [trafficData, setTrafficData] = useState<any[]>([]);

  // Buscar interfaces na montagem do componente
  useEffect(() => {
    const fetchInterfaces = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/interfaces`);
        setInterfaces(response.data);
        setSelectedInterface(response.data[0]?.name || null); // Seleciona a primeira interface por padrão
      } catch (error) {
        console.error("Erro ao buscar interfaces:", error);
      }
    };

    fetchInterfaces();
  }, []);

  // Função para buscar o tráfego da interface selecionada
  const fetchTrafficData = async (interfaceName: string) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/interface-traffic/${interfaceName}`);
      const traffic = response.data.traffic[0];
      setTrafficData(prevData => [
        ...prevData,
        {
          time: new Date().toLocaleTimeString(),
          rxBitsPerSecond: parseInt(traffic["rx-bits-per-second"]),
          txBitsPerSecond: parseInt(traffic["tx-bits-per-second"]),
        },
      ]);
    } catch (error) {
      console.error("Erro ao buscar dados de tráfego:", error);
    }
  };

  // UseEffect para atualizar o tráfego a cada 5 segundos
  useEffect(() => {
    if (selectedInterface) {
      fetchTrafficData(selectedInterface);
      const interval = setInterval(() => {
        fetchTrafficData(selectedInterface);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedInterface]);

  return (
    <Card className="w-full mt-5"> {/* Altera a largura do card para 100% */}
      <CardHeader>
        <CardTitle>Monitoramento de Tráfego</CardTitle>
        <CardDescription>Selecione uma interface para monitorar o tráfego</CardDescription>
      </CardHeader>
      <CardContent>
        <Select onValueChange={setSelectedInterface}>
          <SelectTrigger className="w-full max-w-xs mb-4">
            <SelectValue placeholder="Selecione uma interface" />
          </SelectTrigger>
          <SelectContent>
            {interfaces.map((iface) => (
              <SelectItem key={iface.name} value={iface.name}>
                {iface.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <InterfaceTrafficChart data={trafficData} />
      </CardContent>
    </Card>
  );
};

export default InterfaceMonitor;
