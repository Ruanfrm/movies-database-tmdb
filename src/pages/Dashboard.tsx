import { useEffect, useState } from "react";
import axios from "axios";
import { getApiUrl } from "../utils/apiConfig";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import InterfaceMonitor from "@/component/InterfaceMonitor";
import MikroTikControl from "@/component/MikroTikControl";
import { IpAddressList } from "./IpAddressList";
import AlertDialogIntro from "@/component/AlertDialogIntro";
import { Slider } from "@radix-ui/react-slider";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SystemInfo {
  "cpu-load": number;
  uptime: string;
  version: string;
  "total-memory": string;
  "architecture-name": string;
}

interface SystemVoltage {
  value: number;
  type: string;
}

export function Dashboard() {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [systemVoltage, setSystemVoltage] = useState<SystemVoltage | null>(null);
  const [intervalTime, setIntervalTime] = useState(5000);
  const [cpuData, setCpuData] = useState<number[]>([]);

  useEffect(() => {
    const apiUrl = getApiUrl();
    if (!apiUrl) return;

    const fetchData = async () => {
      try {
        const [cpuResponse, voltageResponse] = await Promise.all([
          axios.get(`${apiUrl}/cpu-usage`),
          axios.get(`${apiUrl}/voltage`)
        ]);

        const cpuLoad = cpuResponse.data["cpu-load"];
        setSystemInfo(cpuResponse.data);
        setSystemVoltage(voltageResponse.data);

        setCpuData((prevData) => [...prevData.slice(-20), cpuLoad]);

        if (cpuLoad > 80) {
          toast.error("CPU em uso crítico!");
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, intervalTime);

    return () => clearInterval(intervalId);
  }, [intervalTime]);

  const handleIntervalChange = (value: number[]) => setIntervalTime(value[0]);

  return (
    <div className="p-4 transition-colors">
      <h2 className="text-xl font-semibold mb-4">Informações do Sistema</h2>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <DataCard title="Uso de CPU" value={`${systemInfo?.["cpu-load"] || 0}%`}>
          <CpuUsageChart cpuData={cpuData} currentLoad={systemInfo?.["cpu-load"] || 0} />
        </DataCard>

        <DataCard title="Tempo de Atividade" value={systemInfo?.uptime || "N/A"} />
        <DataCard title="Memória Total" value={systemInfo?.["total-memory"] || "N/A"} />
        <DataCard title="Versão" value={systemInfo?.version || "N/A"} />
        <DataCard title="Arquitetura" value={systemInfo?.["architecture-name"] || "N/A"} />
        <DataCard title="Voltagem" value={systemVoltage ? `${systemVoltage.value} ${systemVoltage.type}` : "N/A"} />
      </div>

      <InterfaceMonitor />
      <IpAddressList />
      <MikroTikControl />
      <AlertDialogIntro />

      <div className="my-4 p-4 rounded shadow" >
        <h3 className="text-lg font-semibold mb-2">Configurações</h3>
        <label className="block text-sm font-medium mb-2">Intervalo de Atualização (ms)</label>
        <Slider
          min={1000}
          max={10000}
          step={500}
          value={[intervalTime]}
          onValueChange={handleIntervalChange}
          className="w-full h-2 bg-gray-300 rounded cursor-pointer"
        />
        <div className="text-sm mt-2">Intervalo atual: {intervalTime}ms</div>
      </div>
    </div>
  );
}

function DataCard({ title, value, children }: { title: string; value: string; children?: React.ReactNode }) {
  return (
    <Card className="transition-shadow hover:shadow-xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{value ? value : <Skeleton className="h-6 w-full" />}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function CpuUsageChart({ cpuData, currentLoad }: { cpuData: number[]; currentLoad: number }) {
  return (
    <div className="relative w-full h-32">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={cpuData.map((cpu, index) => ({ time: `${index + 1}s`, cpu }))}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" hide />
          <YAxis hide />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="cpu" stroke="#3b82f6" fill="rgba(59, 130, 246, 0.3)" />
        </LineChart>
      </ResponsiveContainer>
      <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center text-white text-lg font-semibold">
        {currentLoad}%
      </div>
    </div>
  );
}
