export type SalesData = {
    order_date: string;
    total_sales: number;
    profit: number;
  };
  

  export interface ProfitState{
    weekly: SalesData[],
    monthly: SalesData[],
    yearly: SalesData[],
    loading: boolean,
    error: string | null
  }