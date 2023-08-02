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
  chartStatusResponseDto: ChartStatusResponseDto;
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

export interface ChartStatusResponseDto {
  chartOneFlag: number;
  chartTwoFlag: number;
  messageIndex: number;
  messageType: string;
  remoteStationCode: string;
  trainStartDate: Date;
}
