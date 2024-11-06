import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface TrafficData {
  time: string;
  rxBitsPerSecond: number;
  txBitsPerSecond: number;
}

interface InterfaceTrafficChartProps {
  data: TrafficData[];
  width?: number;
  height?: number;
}

// Função para formatar os dados em Kbps, Mbps ou Gbps
const formatTraffic = (bitsPerSecond: number): string => {
  if (bitsPerSecond >= 1_000_000_000) {
    return `${(bitsPerSecond / 1_000_000_000).toFixed(2)} Gbps`;
  }
  if (bitsPerSecond >= 1_000_000) {
    return `${(bitsPerSecond / 1_000_000).toFixed(2)} Mbps`;
  }
  if (bitsPerSecond >= 1_000) {
    return `${(bitsPerSecond / 1_000).toFixed(2)} Kbps`;
  }
  return `${bitsPerSecond} bps`;
};

// Configuração do gráfico
const chartConfig = {
  rxBitsPerSecond: {
    label: "Download",
    color: "blue",
  },
  txBitsPerSecond: {
    label: "Upload",
    color: "green",
  },
} satisfies ChartConfig;

const InterfaceTrafficChart = ({ data, width = 800, height = 300 }: InterfaceTrafficChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gráfico de Tráfego de Interface</CardTitle>
        <CardDescription>Monitorando download e upload em tempo real</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            width={width}
            height={height}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey="time" tickLine={false} axisLine={false} />
            <YAxis tickFormatter={formatTraffic} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="rxBitsPerSecond"
              stroke={chartConfig.rxBitsPerSecond.color}
              fillOpacity={0.3}
              fill={chartConfig.rxBitsPerSecond.color}
            />
            <Area
              type="monotone"
              dataKey="txBitsPerSecond"
              stroke={chartConfig.txBitsPerSecond.color}
              fillOpacity={0.3}
              fill={chartConfig.txBitsPerSecond.color}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Tráfego crescente <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Intervalo de tempo em análise
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default InterfaceTrafficChart;
