import { useEffect, useState } from "react";
import axios from "axios";
import { getApiUrl } from "../utils/apiConfig";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Loader } from "../components/ui/loader";
import InterfaceMonitor from "@/component/InterfaceMonitor";
import MikroTikControl from "@/component/MikroTikControl";
import { IpAddressList } from "./IpAddressList";
import AlertDialogIntro from "@/component/AlertDialogIntro";
import { Slider } from "@radix-ui/react-slider";
import { toast } from "sonner"; // Biblioteca para notificações
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
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({
    "cpu-load": 0,
    uptime: "",
    version: "",
    "total-memory": "",
    "architecture-name": "",
  });
  const [systemVoltage, setSystemVoltage] = useState<SystemVoltage>({ value: 0, type: "" });
  const [intervalTime, setIntervalTime] = useState(5000);
  const [cpuData, setCpuData] = useState<number[]>([]); // Histórico de CPU

  useEffect(() => {
    const apiUrl = getApiUrl();
    if (!apiUrl) return;

    const fetchSystemInfo = async () => {
      try {
        const response = await axios.get(`${apiUrl}/cpu-usage`);
        setSystemInfo(response.data);
        setCpuData((prevData) => [...prevData.slice(-20), response.data["cpu-load"]]); // Guarda até 20 valores de histórico
        if (response.data["cpu-load"] > 80) {
          toast.error("CPU em uso crítico!"); // Alerta visual
        }
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

  const handleIntervalChange = (value: number[]) => {
    setIntervalTime(value[0]);
  };

  // Garantindo que systemInfo tenha os dados necessários
  if (!systemInfo || !systemInfo["cpu-load"] || !systemInfo.uptime) {
    return <Loader />;
  }

 
  return (
    <div className="p-4  transition-colors">
      <h2 className="text-xl font-semibold mb-4">Informações do Sistema</h2>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      <Card className="transition-shadow hover:shadow-xl">
  <CardHeader>
    <CardTitle>Uso de CPU</CardTitle>
    <CardDescription>{systemInfo["cpu-load"]}%</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="relative w-full h-32"> {/* Controla o tamanho do gráfico */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={cpuData.map((cpu, index) => ({ time: `${index + 1}s`, cpu }))}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" hide={true} /> {/* Oculta o eixo X para dar mais foco no gráfico */}
          <YAxis hide={true} /> {/* Oculta o eixo Y */}
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="cpu" stroke="#3b82f6" fill="rgba(59, 130, 246, 0.3)" />
        </LineChart>
      </ResponsiveContainer>
      <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center text-white text-lg font-semibold">
        {systemInfo["cpu-load"]}% {/* Exibe a porcentagem centralizada */}
      </div>
    </div>
  </CardContent>
</Card>


        <Card className="transition-shadow hover:shadow-xl">
          <CardHeader>
            <CardTitle>Tempo de Atividade</CardTitle>
            <CardDescription>{systemInfo.uptime}</CardDescription>
          </CardHeader>
        </Card>

        <Card className="transition-shadow hover:shadow-xl">
          <CardHeader>
            <CardTitle>Memória Total</CardTitle>
            <CardDescription>{systemInfo["total-memory"]}</CardDescription>
          </CardHeader>
        </Card>

        <Card className="transition-shadow hover:shadow-xl">
          <CardHeader>
            <CardTitle>Versão</CardTitle>
            <CardDescription>{systemInfo.version}</CardDescription>
          </CardHeader>
        </Card>

        <Card className="transition-shadow hover:shadow-xl">
          <CardHeader>
            <CardTitle>Arquitetura</CardTitle>
            <CardDescription>{systemInfo["architecture-name"]}</CardDescription>
          </CardHeader>
        </Card>

        <Card className="transition-shadow hover:shadow-xl">
          <CardHeader>
            <CardTitle>Voltagem</CardTitle>
            <CardDescription>
              {systemVoltage?.value != null ? `${systemVoltage.value} ${systemVoltage.type}` : "N/A"}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      

      <InterfaceMonitor />
      <IpAddressList />
      <MikroTikControl />
      <AlertDialogIntro />

      <div className="my-4 p-4 rounded shadow" hidden>
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
