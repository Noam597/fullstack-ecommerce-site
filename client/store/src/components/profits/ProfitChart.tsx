import LargeChart from '../charts/large-chart/LargeChart';
import SmallMonthlyChart from '../charts/small-monthly-chart/SmallMonthlyChart';
import SmallYearlyChart from '../charts/small-yearly-chart/SmallYearlyChart';
import type { SalesData } from '../charts/types';

const ProfitChart = ({
  weekly,
  monthly,
  yearly
}: {
  weekly: SalesData[];
  monthly: SalesData[];
  yearly: SalesData[];
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <LargeChart data={weekly} />
      </div>

      <div className="flex flex-col gap-4">
        <SmallMonthlyChart data={monthly} />
        <SmallYearlyChart data={yearly} />
      </div>
    </div>
  );
};



export default ProfitChart