import { useEffect, useState } from "react";
import axios from "axios";
import { getApiUrl } from "../utils/apiConfig"; // Importa a função para obter a URL
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { Loader } from "../components/ui/loader";
import InterfaceMonitor from "@/component/InterfaceMonitor";
import MikroTikControl from "@/component/MikroTikControl";
import { IpAddressList } from "./IpAddressList";
import AlertDialogIntro from "@/component/AlertDialogIntro";

export function Dashboard() {
  const [systemInfo, setSystemInfo] = useState<{
    "cpu-load"?: number;
    uptime?: string;
    version?: string;
    "total-memory"?: string;
    "architecture-name"?: string;
  } | null>(null);

  const [systemVoltage, setSystemVoltage] = useState<{ value?: number, type?: string } | null>(null);
  const [intervalTime, setIntervalTime] = useState<number>(5000);

  useEffect(() => {
    const apiUrl = getApiUrl();
    if (!apiUrl) return; // Impede a execução caso a URL esteja ausente

    const fetchSystemInfo = async () => {
      try {
        const response = await axios.get(`${apiUrl}/cpu-usage`);
        setSystemInfo(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados de CPU:", error);
      }
    };

    const fetchSystemVoltage = async () => {
      try {
        const response = await axios.get(`${apiUrl}/voltage`);
        setSystemVoltage(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados de Voltagem:", error);
      }
    };

    fetchSystemInfo();
    fetchSystemVoltage();

    const intervalId = setInterval(fetchSystemInfo, intervalTime);

    return () => clearInterval(intervalId);
  }, [intervalTime]);

  if (!systemInfo) {
    return <Loader />;
  }

  const handleIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newInterval = parseInt(event.target.value, 10);
    setIntervalTime(newInterval);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Informações do Sistema</h2>
      <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Uso de CPU</CardTitle>
            <CardDescription>{systemInfo["cpu-load"]}%</CardDescription>
          </CardHeader>
          <CardContent />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tempo de Atividade</CardTitle>
            <CardDescription>{systemInfo.uptime}</CardDescription>
          </CardHeader>
          <CardContent />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Memória Total</CardTitle>
            <CardDescription>{systemInfo["total-memory"]}</CardDescription>
          </CardHeader>
          <CardContent />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Versão</CardTitle>
            <CardDescription>{systemInfo.version}</CardDescription>
          </CardHeader>
          <CardContent />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Arquitetura</CardTitle>
            <CardDescription>{systemInfo["architecture-name"]}</CardDescription>
          </CardHeader>
          <CardContent />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Temperatura</CardTitle>
            <CardDescription>
              {systemVoltage?.value != null ? `${systemVoltage.value}${systemVoltage.type}` : "N/A"}
            </CardDescription>
          </CardHeader>
          <CardContent />
        </Card>
      </div>
      <InterfaceMonitor />
      <IpAddressList />
      <MikroTikControl />
      <AlertDialogIntro />

      <div className="mb-4" hidden>
        <label htmlFor="intervalTime" className="block">
          Intervalo de Atualização (ms):
        </label>
        <input
          type="number"
          id="intervalTime"
          value={intervalTime}
          onChange={handleIntervalChange}
          className="mt-2 p-2 border border-gray-300"
          min="1000"
        />
      </div>
    </div>
  );
}
