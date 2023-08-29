export type CollectionType =
  | 'best-high-return'
  | 'best-sip-with-500'
  | 'best-tax-saving'
  | 'best-large-cap'
  | 'best-mid-cap'
  | 'best-small-cap';

export interface PopularMutualFund {
  aum: number;
  available_for_investment: boolean;
  category: string;
  direct_scheme_code: null | string;
  expense_ratio: string;
  fund_house: string;
  fund_manager: string;
  groww_rating: number | null;
  groww_scheme_code: string;
  id: null;
  launch_date: Date;
  logo_url: string;
  mean_return: number;
  min_investment: number;
  min_sip_investment: number;
  plan_type: string;
  regular_search_id: null | string;
  return1y: number;
  return3y: number;
  risk: string;
  risk_rating: number;
  scheme_code: string;
  scheme_name: string;
  scheme_search: null;
  scheme_type: string;
  search_id: string;
  sip_allowed: boolean;
  sub_category: string;
  sub_sub_category: null | string;
  super_category: string;
  swp_frequencies: null;
}

export interface SearchList {
  allFacets: any[];
  content: Content[];
  didYouMean: null;
  didYouMeanContent: null;
  facetFields: any[];
  facetPivotFields: any[];
  facetQueryResult: FacetQueryResult;
  facetResultPages: any[];
  fieldStatsResults: null;
  first: null;
  highlighted: any[];
  last: null;
  maxScore: null;
  number: null;
  numberOfElements: null;
  size: null;
  sort: null;
  totalElements: null;
  totalPages: null;
}

export interface Content {
  analytics_label: string;
  bse_scrip_code: null | string;
  entity_type: string;
  expiry: Date | null;
  fund_name: null | string;
  groww_contract_id: null | string;
  id: string;
  isin: null | string;
  nse_scrip_code: null | string;
  scheme_code: null | string;
  scheme_name: null | string;
  scheme_search: null | string;
  search_id: string;
  search_string: null;
  term_page_view: number;
  tiker: null;
  title: string;
  underlying_search_id: null | string;
}

export interface FacetQueryResult {
  content: any[];
  first: null;
  last: null;
  number: null;
  numberOfElements: null;
  size: null;
  sort: null;
  totalElements: null;
  totalPages: null;
}

export interface CollectionList {
  collections: Collection[];
  description: string;
  heading: string;
  image_url: string;
  image_url_dark: string;
}

export interface Collection {
  amc: string;
  aum: number;
  available_for_investment: number;
  category: string;
  direct_fund: null;
  direct_scheme_name: null;
  direct_search_id: null;
  doc_required: boolean;
  doc_type: string;
  enable: null;
  fund_house: string;
  fund_manager: string;
  fund_name: string;
  groww_rating: number;
  groww_scheme_code: string;
  id: string;
  launch_date: Date;
  logo_url: string;
  lumpsum_allowed: boolean;
  min_investment_amount: number;
  min_sip_investment: number;
  nav: null;
  page_view: number;
  plan_type: string;
  registrar_agent: string;
  return1d: number;
  return1y: number;
  return3y: number;
  return5y: number | null;
  risk: string;
  risk_rating: number;
  scheme_code: string;
  scheme_name: string;
  scheme_type: string;
  search_id: string;
  sip_allowed: boolean;
  sub_category: string;
  sub_sub_category: Array<null | string>;
  term_page_view: number;
}

export interface FundDetails {
  additional_details: AdditionalDetails;
  amc: string;
  amc_info: AmcInfo;
  amc_page_url: string;
  analysis: Analysis[];
  aum: number;
  available_for_investment: boolean;
  benchmark: string;
  benchmark_name: string;
  blocked_reason: null;
  category: string;
  category_info: CategoryInfo;
  closed_date: null;
  closed_scheme: boolean;
  crisil_rating: null;
  description: string;
  direct_scheme_code: string;
  dividend: null;
  doc_required: boolean;
  exit_load: string;
  expense_ratio: string;
  fund_events: null;
  fund_house: string;
  fund_manager: string;
  fund_manager_details: FundManagerDetail[];
  fund_news: null;
  groww_rating: number;
  groww_scheme_code: string;
  historic_exit_loads: HistoricExitLoad[];
  historic_fund_expense: HistoricFundExpense[];
  holdings: Holding[];
  isin: string;
  launch_date: string;
  lock_in: LockIn;
  logo_url: string;
  lumpsum_allowed: boolean;
  max_sip_investment: number;
  meta_desc: string;
  meta_robots: string;
  meta_title: string;
  min_investment_amount: number;
  min_sip_investment: number;
  min_withdrawal: number;
  mini_additional_investment: number;
  nav: number;
  nav_date: string;
  plan_type: string;
  prod_code: string;
  purchase_multiplier: number;
  redemption_amount_multiple: null;
  redemption_qty_multiplier: null;
  registrar_agent: string;
  regular_search_id: string;
  return_stats: SimpleReturn[];
  rta_details: RtaDetails;
  rta_scheme_code: string;
  scheme_code: string;
  scheme_name: string;
  scheme_type: string;
  search_id: string;
  sid_url: string;
  simple_return: SimpleReturn;
  sip_allowed: boolean;
  sip_multiplier: number;
  sip_return: SimpleReturn;
  stamp_duty: string;
  stats: Stat[];
  stp_flag: boolean;
  sub_category: string;
  sub_sub_category: string;
  super_category: string;
  switch_flag: boolean;
  swp_flag: boolean;
  swp_frequencies: null;
  unique_groww_scheme_code: null;
  video_url: null;
}

export interface AdditionalDetails {
  days: number;
  exit_age: any;
  lock_in_yrs: number;
  lump_sum_not_allowed_reason: any;
  max_age: any;
  max_amt: any;
  min_age: any;
  redeem_not_allowed_reason: any;
  sip_not_allowed_reason: any;
}

export interface AmcInfo {
  address: string;
  amc: string;
  assets_managed: any;
  aum: number;
  description: string;
  email: any;
  launch_date: Date;
  more_description: string;
  name: string;
  phone: string;
  rank: string;
  service_officer: any;
  sponsor: any;
  trustee: any;
  vro_amc_id: any;
  vro_amc_short_name: any;
  vro_ceo: any;
  vro_cio: any;
  vro_city: any;
  vro_fax: any;
  vro_investor_relation_officer: any;
  vro_management_trustee: any;
  vro_modified_ts: any;
  vro_owner_type: any;
  vro_pin: any;
  vro_row_number: any;
  vro_website: string;
}

export interface Analysis {
  analysis_data: string;
  analysis_desc: string;
  analysis_subject: string;
  analysis_type: string;
  rating: any;
  scheme_code: string;
}

export interface CategoryInfo {
  category: string;
  category_helper_text: string;
  definition: string;
  description: string;
  sub_type: string;
  tags: any;
  tax_impact: string;
}

export interface FundManagerDetail {
  date_from: Date;
  education: null | string;
  experience: null | string;
  funds_managed: FundsManaged[];
  person_id: number;
  person_name: string;
  plan_id: string;
  scheme_code: string;
}

export interface FundsManaged {
  scheme_code: string;
  scheme_name: string;
  search_id: string;
}

export interface HistoricExitLoad {
  as_on_date: Date;
  back_load: number;
  cdsc: boolean;
  front_load: number;
  note: null;
}

export interface HistoricFundExpense {
  as_on_date: Date;
  expense_ratio: number;
  frequency: string;
  turn_over_ratio: number | null;
}

export interface Holding {
  company_name: string;
  corpus_per: number;
  instrument_name: string;
  market_cap: any;
  market_value: number;
  nature_name: string;
  portfolio_date: Date;
  rating: any;
  rating_market_cap: any;
  scheme_code: string;
  sector_name: any | string;
  stock_search_id: any | string;
}

export interface LockIn {
  days: number;
  months: number;
  years: number;
}

export interface SimpleReturn {
  alpha: number | null;
  beta: number | null;
  cat_return1y: number | null;
  cat_return3m: number | null;
  cat_return3y: number | null;
  cat_return5y: number | null;
  cat_return6m: number | null;
  cat_return_since_launch: any;
  index_return1y: number | null;
  index_return3y: number | null;
  index_return5y: number | null;
  index_return_since_launch: any;
  information_ratio: number | null;
  mean_return: number | null;
  plan_id: any;
  rank1yr: number | null;
  rank3m: number | null;
  rank3yr: number | null;
  rank5yr: number | null;
  rank6m: number | null;
  return10y: number | null;
  return1d: number | null;
  return1m: number | null;
  return1w: number | null;
  return1y: number | null;
  return2y: number | null;
  return3m: number | null;
  return3y: number | null;
  return4y: number | null;
  return5y: number | null;
  return6m: number | null;
  return9m: number | null;
  return_default: number | null;
  return_since_created: number | null;
  risk: any | string;
  risk_rating: number | null;
  scheme_code: any | string;
  sharpe_ratio: number | null;
  sortino_ratio: number | null;
  standard_deviation: number | null;
  vro_modified_ts: any;
  vro_return2y: any;
  vro_return4y: any;
  vro_return9m: any;
  vro_return_date: any;
  vro_return_ytd: any;
  vro_row_number: any;
}

export interface RtaDetails {
  address: string;
  custodian_name: string;
  email: string;
  rta_name: string;
  website: string;
}

export interface Stat {
  stat_1y: number;
  stat_3y: number;
  stat_5y: number;
  stat_all: number | null;
  title: string;
  type: string;
}

export interface FundGraph {
  benchmark: null;
  folio: Folio;
}

export interface Folio {
  data: Array<number[]>;
  name: string;
}
