export interface InSHORT {
  author: string;
  content: string;
  date: string;
  id: string;
  imageUrl: string;
  readMoreUrl?: string;
  time: string;
  title: string;
  url: string;
}

export interface Country {
  id: number;
  name: string;
  iso2: string;
}

export interface State {
  id: number;
  name: string;
  iso2: string;
}

export interface City {
  id: number;
  name: string;
}

export interface MyInvestment {
  cagr: number;
  fund_name: string;
  invested: number;
  investing_date: Date;
  return: number;
  return_percentage: number;
  today_value: number;
  total: number;
  value: number;
}
