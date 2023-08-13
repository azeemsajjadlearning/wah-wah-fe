export interface TrainList {
  name: string;
  number: string;
}

export interface TrainDetail {
  duration: string;
  stationFrom: string;
  stationCode: StationList[];
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

export interface StationCode {
  name: string;
  code: string;
}

export interface TrainList {
  arrivalTime: string;
  atasOpted: string;
  avlClasses: string[];
  departureTime: string;
  distance: string;
  duration: string;
  flexiFlag: string;
  fromStnCode: string;
  runningFri: string;
  runningMon: string;
  runningSat: string;
  runningSun: string;
  runningThu: string;
  runningTue: string;
  runningWed: string;
  toStnCode: string;
  trainName: string;
  trainNumber: string;
  trainOwner: string;
  trainType: string[];
  trainsiteId: string;
  availability: any;
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
