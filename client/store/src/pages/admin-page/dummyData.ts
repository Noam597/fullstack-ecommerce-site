export type SalesDataWithProfit = {
    order_date: string;
    total_sales: number;
    profit: number;
  };
import type { SalesData } from "../../redux/admin/profits/types";  
  
  const grossMargin = 0.25;

  export const dummyWeeklyData: SalesData[] = [
    { order_date: "2025-12-01", total_sales: 734.93, profit: 734.93 * grossMargin },
    { order_date: "2025-12-02", total_sales: 589.95, profit: 589.95 * grossMargin },
    { order_date: "2025-12-03", total_sales: 164.97, profit: 164.97 * grossMargin },
    { order_date: "2025-12-04", total_sales: 229.97, profit: 229.97 * grossMargin },
    { order_date: "2025-12-05", total_sales: 452.12, profit: 452.12 * grossMargin },
    { order_date: "2025-12-06", total_sales: 612.45, profit: 612.45 * grossMargin },
    { order_date: "2025-12-07", total_sales: 798.34, profit: 798.34 * grossMargin },
  ];
  


  export const dummyMonthlyData: SalesData[] = [
    { order_date: "2025-12-01", total_sales: 734.93 , profit: 734.93 * grossMargin },
    { order_date: "2025-12-02", total_sales: 589.95, profit: 589.95 * grossMargin  },
    { order_date: "2025-12-03", total_sales: 164.97 , profit: 164.97* grossMargin },
    { order_date: "2025-12-04", total_sales: 229.97, profit: 229.97 * grossMargin  },
    { order_date: "2025-12-05", total_sales: 452.12 , profit: 452.12 * grossMargin },
    { order_date: "2025-12-06", total_sales: 612.45 , profit: 612.45 * grossMargin },
    { order_date: "2025-12-07", total_sales: 798.34 , profit: 798.34 * grossMargin },
    { order_date: "2025-12-08", total_sales: 543.22 , profit: 543.22 * grossMargin },
    { order_date: "2025-12-09", total_sales: 671.12 , profit: 671.12 * grossMargin },
    { order_date: "2025-12-10", total_sales: 789.99 , profit: 789.99 * grossMargin },
    { order_date: "2025-12-11", total_sales: 234.56 , profit: 234.56 * grossMargin },
    { order_date: "2025-12-12", total_sales: 412.45 , profit: 412.45 * grossMargin },
    { order_date: "2025-12-13", total_sales: 598.77 , profit: 598.77 * grossMargin },
    { order_date: "2025-12-14", total_sales: 723.34 , profit: 723.34 * grossMargin },
    { order_date: "2025-12-15", total_sales: 812.11 , profit: 812.11 * grossMargin },
    { order_date: "2025-12-16", total_sales: 543.45 , profit: 543.45 * grossMargin },
    { order_date: "2025-12-17", total_sales: 664.33 , profit: 664.33 * grossMargin },
    { order_date: "2025-12-18", total_sales: 712.78 , profit: 712.78 * grossMargin },
    { order_date: "2025-12-19", total_sales: 821.45 , profit: 821.45 * grossMargin },
    { order_date: "2025-12-20", total_sales: 432.90 , profit: 432.90 * grossMargin },
    { order_date: "2025-12-21", total_sales: 654.12 , profit: 654.12 * grossMargin },
    { order_date: "2025-12-22", total_sales: 589.76 , profit: 589.76 * grossMargin },
    { order_date: "2025-12-23", total_sales: 732.11 , profit: 732.11 * grossMargin },
    { order_date: "2025-12-24", total_sales: 810.45 , profit: 810.45 * grossMargin },
    { order_date: "2025-12-25", total_sales: 912.34 , profit: 912.34 * grossMargin },
    { order_date: "2025-12-26", total_sales: 623.44 , profit: 623.44 * grossMargin },
    { order_date: "2025-12-27", total_sales: 512.33 , profit: 512.33 * grossMargin },
    { order_date: "2025-12-28", total_sales: 745.12 , profit: 745.12 * grossMargin },
    { order_date: "2025-12-29", total_sales: 678.99 , profit: 678.99 * grossMargin },
    { order_date: "2025-12-30", total_sales: 832.45 , profit: 832.45 * grossMargin },
    { order_date: "2025-12-31", total_sales: 912.11 , profit: 912.11 * grossMargin },
  ];
  

  export const dummyYearlyData: SalesData[] = [
    { order_date: "2025-01-01", total_sales: 12_345.67 , profit: 12_345.67 * grossMargin },
    { order_date: "2025-02-01", total_sales: 9_876.54 , profit: 9_876.54 * grossMargin },
    { order_date: "2025-03-01", total_sales: 14_321.88 , profit: 14_321.88 * grossMargin },
    { order_date: "2025-04-01", total_sales: 11_234.56 , profit: 11_234.56 * grossMargin },
    { order_date: "2025-05-01", total_sales: 16_789.99 , profit: 16_789.99 * grossMargin },
    { order_date: "2025-06-01", total_sales: 13_456.78 , profit: 13_456.78 * grossMargin },
    { order_date: "2025-07-01", total_sales: 18_234.22 , profit: 18_234.22 * grossMargin },
    { order_date: "2025-08-01", total_sales: 15_678.44 , profit: 15_678.44 * grossMargin },
    { order_date: "2025-09-01", total_sales: 17_345.12 , profit: 17_345.12 * grossMargin },
    { order_date: "2025-10-01", total_sales: 19_012.34 , profit: 19_012.34 * grossMargin },
    { order_date: "2025-11-01", total_sales: 16_789.11 , profit: 16_789.11 * grossMargin },
    { order_date: "2025-12-01", total_sales: 21_345.67 , profit: 21_345.67 * grossMargin },
  ];
  