import {
    LineChart,
    Line,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip
  } from "recharts";
  import type { SalesData } from "../types";
  
  type Props = {
    data: SalesData[];
  };
  
  export const SmallMonthlyChart = ({ data }: Props) => {
    return (
      <div className="p-4 bg-slate-900 rounded-lg">
        <h3 className="mb-2 text-sm font-medium text-white">
          Revenue — This Month
        </h3>
  
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={data}>
            <XAxis
              dataKey="order_date"
              hide
            />
            <YAxis hide />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total_sales"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };
  
export default SmallMonthlyChart