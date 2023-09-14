export interface Investment {
  _id: string;
  user_id: string;
  schema_code: string;
  schema_name: string;
  type: string;
  active: boolean;
  current_nav: number;
  one_day_nav?: number;
  total_amount?: number;
  total_value?: number;
  xirr?: number;
  details: InvestmentDetail[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InvestmentDetail {
  _id: string;
  investment_id: string;
  date: Date;
  nav: number;
  amount: number;
  current_value?: number;
  redemption_date: null;
  resumption: null;
  createdAt: Date;
  updatedAt: Date;
}
