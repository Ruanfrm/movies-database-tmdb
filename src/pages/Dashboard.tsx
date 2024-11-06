import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { Loader } from "../components/ui/loader"; // Um componente Loader que você pode criar ou usar da biblioteca
import InterfaceMonitor from "@/component/InterfaceMonitor";
import MikroTikControl from "@/component/MikroTikControl";
import { IpAddressList } from "./IpAddressList";
import AlertDialogIntro from "@/component/AlertDialogIntro";

export function Dashboard() {
  const [systemInfo, setSystemInfo] = useState(null);
  const [systemName, setSystemName] = useState(null);
  const [systemVoltage, setSystemVoltage] = useState(null);
  const [intervalTime, setIntervalTime] = useState(() => {
    return parseInt(localStorage.getItem("updateInterval") || "5000");
  });


  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/cpu-usage`
        );
        setSystemInfo(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados de CPU:", error);
      }
    };

    const fetchSystemName = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/system-name`
        );
        setSystemName(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados de CPU:", error);
      }
    };

    const fetchSystemVoltage = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/voltage`
        );
        setSystemVoltage(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados de Voltagem:", error);
      }
    };

    fetchSystemInfo();
    fetchSystemName();
    fetchSystemVoltage();
    const intervalId = setInterval(fetchSystemInfo, intervalTime);

    return () => clearInterval(intervalId);
  }, [intervalTime]);

  if (!systemInfo) {
    return <Loader />; // Usando um componente Loader para indicar carregamento
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Informações do Sistema</h2>
      <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Uso de CPU</CardTitle>
            <CardDescription>{systemInfo["cpu-load"]}%</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Aqui você pode adicionar conteúdo adicional se necessário */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tempo de Atividade</CardTitle>
            <CardDescription>{systemInfo.uptime}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Aqui você pode adicionar conteúdo adicional se necessário */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Memória Total</CardTitle>
            <CardDescription>{systemInfo["total-memory"]}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Aqui você pode adicionar conteúdo adicional se necessário */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Versão</CardTitle>
            <CardDescription>{systemInfo.version}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Aqui você pode adicionar conteúdo adicional se necessário */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Arquitetura</CardTitle>
            <CardDescription>{systemInfo["architecture-name"]}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Aqui você pode adicionar conteúdo adicional se necessário */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Temperatura</CardTitle>
            <CardDescription>
              {systemVoltage?.value != null ? `${systemVoltage.value}V` : "N/A"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Aqui você pode adicionar conteúdo adicional se necessário */}
          </CardContent>
        </Card>
      </div>
      <InterfaceMonitor />
      <IpAddressList />
      <MikroTikControl />
      <AlertDialogIntro />
    </div>
  );
}
