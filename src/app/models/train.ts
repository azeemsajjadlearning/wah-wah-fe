export interface TrainList {
  alternateEnquiryFlag: string;
  oneStopJourny: string;
  quotaList: string[];
  serveyFlag: string;
  timeStamp: Date;
  trainBtwnStnsList: TrainBtwnStnsList[];
  vikalpInSpecialTrainsAccomFlag: string;
}

export interface TrainBtwnStnsList {
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
  availability?: SeatAvailability;
}

export interface SeatAvailability {
  altAvlEnabled: string;
  altClsEnabled: string;
  altTrainEnabled: string;
  avlDayList: AvlDayList[];
  baseFare: string;
  cateringCharge: string;
  cateringFlag: string;
  distance: string;
  dynamicFare: string;
  enqClass: string;
  from: string;
  ftBookingMsgFlag: string;
  fuelAmount: string;
  informationMessage: InformationMessage[];
  insuredPsgnCount: string;
  lastUpdateTime: string;
  nextEnqDate: Date;
  otherCharge: string;
  otpAuthenticationFlag: string;
  preEnqDate: Date;
  quota: string;
  rdsTxnPwdFlag: string;
  reTry: string;
  reqEnqParam: string;
  reservationCharge: string;
  serviceTax: string;
  superfastCharge: string;
  taRdsFlag: string;
  tatkalFare: string;
  timeStamp: Date;
  to: string;
  totalCollectibleAmount: string;
  totalConcession: string;
  totalFare: string;
  trainName: string;
  trainNo: string;
  travelInsuranceCharge: string;
  travelInsuranceServiceTax: string;
  upiRdsFlag: string;
}

export interface AvlDayList {
  availablityDate: string;
  availablityStatus: string;
  availablityType: string;
  currentBkgFlag: string;
  reasonType: string;
  wlType: string;
}

export interface InformationMessage {
  message: string;
  paramName: string;
  popup: string;
}

export interface TrainSchedule {
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

export interface PNRStatus {
  code: number;
  data: Data;
  error: string;
  message: string;
  status: boolean;
}

export interface Data {
  boardingInfo: BoardingInfo;
  destinationInfo: BoardingInfo;
  passengerInfo: PassengerInfo[];
  seatInfo: SeatInfo;
  trainInfo: TrainInfo;
  trainRoutes: BoardingInfo[];
}

export interface BoardingInfo {
  arrivalTime: string;
  departureTime: string;
  distance: string;
  haltTime: string;
  platform: string;
  stationCode: string;
  stationId: number;
  stationName: string;
  trainId: number;
  travellingDay: number;
}

export interface PassengerInfo {
  currentBerthNo: string;
  currentCoach: string;
}

export interface SeatInfo {
  berth: string;
  coach: string;
  noOfSeats: number;
}

export interface TrainInfo {
  boarding: string;
  boardingDayCount: null;
  destination: string;
  dt: string;
  fromStationName: null;
  name: string;
  origin: null;
  toStationName: null;
  trainNo: string;
}

export interface LiveStatus {
  age: string;
  dest: string;
  dest_city: City;
  doo: string;
  message: string;
  origin: string;
  origin_city: City;
  rakes: Rake[];
  trainNo: string;
  train_detail: TrainDetail;
  train_name: string;
}

export interface City {
  city: string;
  city_id: number;
  scode: string;
  sname: string;
}

export interface Rake {
  alertMessage: string;
  cncldBwFrom: string;
  cncldBwTo: string;
  cncldFrmStn: string;
  cncldToStn: string;
  crowdsourced_at: null;
  csTrainTravelled: number;
  departed: boolean;
  isRunningDataAvailable: boolean;
  longSummaryMessage: string;
  scraped_at: Date;
  scraped_by: string;
  scraped_by_version: string;
  shortSummaryMsg: any[];
  startDate: string;
  stations: Station[];
  terminated: boolean;
  totalLateMins: number;
}

export interface Station {
  actArr?: string;
  actDep?: string;
  arr: boolean;
  arr_from_crowd: boolean;
  arrive?: string;
  day: number;
  dayCnt: number;
  delayArr: number;
  delayDep: number;
  dep: boolean;
  dep_from_crowd: boolean;
  depart?: string;
  departed?: boolean;
  device_count: number;
  distance: number;
  dvrtdStn: boolean;
  halt: Halt;
  isDummyData: boolean;
  lastUpdateTime?: string;
  lat?: number;
  lng?: number;
  location_count: number;
  pfNo: number;
  platform?: string;
  schDayCnt: number;
  scode: string;
  scraped: boolean;
  sid: number;
  sname: string;
  stnCode: string;
  stoppingStn: boolean;
  stops: number;
  travelled: boolean;
  updWaitngArr: boolean;
  updWaitngDep: boolean;
  intermediateStation?: Station[];
}

export enum Halt {
  The0000 = '00:00',
  The0100 = '01:00',
  The0200 = '02:00',
  The0400 = '04:00',
  The0500 = '05:00',
  The0700 = '07:00',
  The0800 = '08:00',
  The1000 = '10:00',
}

export interface TrainDetail {
  class: string;
  distance: number;
  duration: number;
  meta_info: MetaInfo;
  pantry_car: number;
  rake_type: string;
}

export interface MetaInfo {
  content: Content[];
  popular_stations: Array<Array<number | string>>;
  train_description: null;
}

export interface Content {
  data: string;
  title: string;
}

export interface TrainComposition {
  avlRemoteForBooking: string;
  cdd: Car[];
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

export interface Car {
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

export interface VacantBerth {
  berthCode: string;
  berthNumber: number;
  cabinCoupe: null;
  cabinCoupeNo: string;
  coachName: string;
  from: string;
  splitNo: number;
  to: string;
}

export interface Coach {
  bdd: Bdd[];
  coachName: string;
  error: null;
}

export interface Bdd {
  berthCode: BerthCode;
  berthNo: number;
  bsd: BSD[];
  cabinCoupe: null;
  cabinCoupeNameNo: string;
  enable: boolean;
  from: string;
  quotaCntStn: string;
  to: string;
}

export enum BerthCode {
  L = 'L',
  M = 'M',
  P = 'P',
  R = 'R',
  U = 'U',
}

export interface BSD {
  from: string;
  occupancy: boolean;
  quota: string;
  splitNo: number;
  to: string;
}
