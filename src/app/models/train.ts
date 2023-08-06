export interface TrainList {
  name: string;
  number: string;
}

export interface TrainDetail {
  duration: string;
  stationFrom: string;
  stationList: StationList[];
  stationTo: string;
  timeStamp: Date;
  trainName: string;
  trainNumber: string;
  trainOwner: string;
  trainRunsOnFri: string;
  trainRunsOnMon: string;
  trainRunsOnSat: string;
  trainRunsOnSun: string;
  trainRunsOnThu: string;
  trainRunsOnTue: string;
  trainRunsOnWed: string;
}

export interface StationList {
  arrivalTime: string;
  boardingDisabled: string;
  dayCount: string;
  departureTime: string;
  distance: string;
  haltTime: string;
  routeNumber: string;
  stationCode: string;
  stationName: string;
  stnSerialNumber: string;
}

export interface CoachDetail {
  avlRemoteForBooking: string;
  cdd: Cdd[];
  chartOneDate: Date;
  chartStatusResponseDto: any;
  chartTwoDate: Date;
  destinationStation: string;
  error: null;
  from: string;
  nextRemote: string;
  remote: string;
  remoteLocationChartDate: Date;
  to: string;
  trainName: string;
  trainNo: string;
  trainStartDate: Date;
}

export interface Cdd {
  classCode: string;
  coachName: string;
  positionFromEngine: number;
  vacantBerths: number;
}

export interface Stations {
  body: Body[];
  code: number;
  error: null;
  meta: any;
  status: any;
}

export interface StationData {
  airport_code?: string;
  airport_name?: string;
  airport_name_hi?: string;
  code: string;
  display_location: string;
  display_name: string;
  display_name_bn: string;
  display_name_gu: string;
  display_name_hi: string;
  display_name_kn: string;
  display_name_ml: string;
  display_name_mr: string;
  display_name_or: string;
  display_name_pa: string;
  display_name_ta: string;
  display_name_te: string;
  name: string;
  name_bn: string;
  name_gu: string;
  name_hi: string;
  name_kn: string;
  name_ml: string;
  name_mr: string;
  name_or: string;
  name_pa: string;
  name_ta: string;
  name_te: string;
  type: string;
}

export interface SearchedTrain {
  alternate_stations: boolean;
  alternate_stations_data?: any[];
  alternate_stations_text?: string;
  alternate_stations_title?: string;
  arrival: Date;
  availability: any[];
  availability_count: number;
  cache_time: number;
  category: string[];
  classes: any[];
  departure: Date;
  destination: any;
  destination_name: any;
  duration: string;
  least_price: number;
  message_enabled: string;
  message_text: string;
  runningOn: RunningOn;
  source: any;
  source_name: any;
  stationCodeMatch: number;
  tatkal_enabled: boolean;
  tatkal_text: any;
  trainFullName: string;
  trainName: string;
  trainNumber: string;
  trainOwner: number;
  train_type: any;
}

export interface RunningOn {
  sun: string;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
}

export interface TrainStatus {
  current_station: string;
  server_timestamp: Date;
  stations: StatusStation[];
  terminated: boolean;
  time_of_availability: string;
  train_status_message: string;
}

export interface StatusStation {
  actual_arrival_date: string;
  actual_arrival_time: string;
  actual_departure_date: string;
  actual_departure_time: string;
  arrivalTime: string;
  dayCount: string;
  departureTime: string;
  distance: string;
  expected_platform: number | string;
  haltTime: number;
  routeNumber: string;
  stationCode: string;
  stationName: string;
  stnSerialNumber: string;
  date?: any;
}
