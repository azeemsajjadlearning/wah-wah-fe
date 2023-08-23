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
