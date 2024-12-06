export interface TrendData {
  currentMonth: number;
  lastMonth: number;
  percentageChange: number;
  trend: 'increase' | 'decrease' | 'unchanged';
}

export interface PrintOrdersStatistic {
  orders: TrendData;
  pages: TrendData;
}


export interface StatisticResponse {
  data: {
    purchaseOrders: TrendData;
    printOrders: PrintOrdersStatistic;
  };
  message: string;
}

export interface AdminStatisticResponse {
  data: {
    purchaseOrders: {
      describe: string;
      amount: number;
      lastMonthAmount: number;
      percentageChange: number;
      trend: 'increase' | 'decrease' | 'unchanged';
    };
    printOrders: {
      describe: string;
      currentMonthCount: number;
      lastMonthCount: number;
      currentMonthPagesConsumed: number;
      lastMonthPagesConsumed: number;
      percentageChange: number;
      trend: 'increase' | 'decrease' | 'unchanged';
    };
    pages: {
      describe: string;
      currentMonthPagesConsumed: number;
      lastMonthPagesConsumed: number;
      percentageChange: number;
      trend: 'increase' | 'decrease' | 'unchanged';
    };
  };
  message: string;
}