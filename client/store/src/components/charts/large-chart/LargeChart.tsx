import {
    BarChart,
    Bar,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
  } from "recharts";
  import type { SalesData } from "../types.ts";
  
  type Props = {
    data: SalesData[];
  };
  
 const LargeChart = ({ data }: Props) => {
    return (
      <div className="h-full p-4 bg-slate-900 rounded-lg">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Revenue — Last 7 Days
        </h2>
  
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
            <XAxis
              dataKey="order_date"
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomToolTip/>}/>
            <Bar
              dataKey="total_sales"
              fill="#8b5cf6"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="profit"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };


  type CustomTooltipProps = {
    active?: boolean;
    payload?: {
      value?: number;
      name?: string;
      dataKey?: string;
    }[];
    label?: string;
  };
  
  const CustomToolTip = ({ active, payload, label }: CustomTooltipProps) => {
    if (!active || !payload || payload.length === 0) return null;
  
    return (
      <div className="p-4 bg-slate-900 rounded-md">
        <p className="text-white font-medium">{label}</p>
        <p className="text-white text-sm">
          Revenue: <span>${payload.find(p => p.dataKey === "total_sales")?.value}</span>
        </p>
        <p className="text-white text-sm">
          Profit: <span>${payload.find(p => p.dataKey === "profit")?.value}</span>
        </p>
      </div>
    );
  };
  
  export default LargeChart;