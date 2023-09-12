export interface CreateInvestment {
  schema_id: string;
  type: string;
  date: Date;
  amount: number;
}

export interface Investment {
  _id: string;
  active: boolean;
  amount: number;
  current_value?: number | null;
  date: Date;
  nav: number;
  current_nav: number | null;
  redemption_amount: string | null;
  redemption_date: string | null;
  schema_id: string;
  schema_name?: string;
  type: string;
  user_id: string;
  total_amount_invested?: number;
  total_return?: number;
}
