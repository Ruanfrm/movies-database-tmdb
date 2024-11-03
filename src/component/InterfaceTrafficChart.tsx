// InterfaceTrafficChart.tsx

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

interface TrafficData {
  time: string;
  rxBitsPerSecond: number;
  txBitsPerSecond: number;
}

interface InterfaceTrafficChartProps {
  data: TrafficData[];
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

const InterfaceTrafficChart = ({ data }: InterfaceTrafficChartProps) => {
  return (
    <AreaChart
      data={data}
      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      width={1000} // Ajustar conforme necessário
      height={300}
      className="mt-5 p-3 "
    >
      <CartesianGrid vertical={false} />
      <XAxis dataKey="time" tickLine={false} axisLine={false} />
      <YAxis tickFormatter={formatTraffic} />
      <Tooltip formatter={(value: number) => formatTraffic(value)} />
      <Area
        type="monotone"
        dataKey="rxBitsPerSecond"
        stroke="blue"
        fillOpacity={0.3}
        fill="blue"
      />
      <Area
        type="monotone"
        dataKey="txBitsPerSecond"
        stroke="green"
        fillOpacity={0.3}
        fill="green"
      />
    </AreaChart>
  );
};

export default InterfaceTrafficChart;
