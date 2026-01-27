import {
    AreaChart,
    Area,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip
  } from "recharts";
  import type { SalesData } from "../types";
  
  type Props = {
    data: SalesData[];
  };
  
  export const SmallYearlyChart = ({ data }: Props) => {
    return (
      <div className="p-4 bg-slate-900 rounded-lg">
        <h3 className="mb-2 text-sm font-medium text-white">
          Revenue — This Year
        </h3>
  
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={data}>
            <XAxis dataKey="order_date" hide />
            <YAxis hide />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="total_sales"
              stroke="#38bdf8"
              fill="#38bdf8"
              fillOpacity={0.2}
            />
            <Area
              type="monotone"
              dataKey="profit"
              stroke="#22c55e"
              fill="#22c55e"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };
  

export default SmallYearlyChart