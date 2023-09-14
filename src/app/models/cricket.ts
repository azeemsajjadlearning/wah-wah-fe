export interface Match {
  _uid: number;
  ballsPerOver: number | null;
  countryHighlightsUrl: RecentInfos;
  countryLiveStreamUrl: RecentInfos;
  coverage: Coverage;
  coverageNote: CoverageNote;
  dayType: DayType;
  drawOdds: null;
  endDate: Date;
  fantasyPickStoryId: null;
  floodlit: Floodlit;
  format: Format;
  generalClassId: number;
  generalNumber: null;
  generatedAt: Date;
  ground: Ground;
  hasSuperStats: boolean;
  highlightsUrl: null;
  id: number;
  internationalClassId: number | null;
  internationalNumber: null | string;
  isCancelled: boolean;
  isScheduledInningsComplete: boolean;
  isSuperOver: boolean;
  languages: Language[];
  liveBalls: number | null;
  liveBlogStoryId: number | null;
  liveInning: number | null;
  liveInningPredictions: null;
  liveOvers: number | null;
  liveOversPending: number | null;
  livePlayers: null;
  liveRecentBalls: null;
  liveStreamUrl: null;
  objectId: number;
  previewStoryId: number | null;
  reportStoryId: number | null;
  resultStatus: number | null;
  scheduleNote: ScheduleNote;
  scribeId: number;
  season: string;
  series: Series;
  slug: string;
  stage: Stage;
  startDate: Date;
  startTime: Date;
  state: State;
  status: Status;
  statusEng: Status;
  statusText: null | string;
  subClassId: null;
  teams: TeamElement[];
  timePublished: boolean;
  title: string;
  tossWinnerChoice: number | null;
  tossWinnerTeamId: number | null;
  totalGalleries: number;
  totalImages: number;
  totalStories: number;
  totalVideos: number;
  winnerTeamId: number | null;
}

export interface RecentInfos {}

export enum Coverage {
  N = 'N',
  Y = 'Y',
}

export enum CoverageNote {
  Empty = '',
  ReserveDayAvailable = 'Reserve day available',
}

export enum DayType {
  Multi = 'MULTI',
  Single = 'SINGLE',
}

export enum Floodlit {
  Day = 'day',
  Daynight = 'daynight',
  Night = 'night',
}

export enum Format {
  Odi = 'ODI',
  T20 = 'T20',
  Test = 'TEST',
}

export interface Ground {
  country: Country;
  id: number;
  image: Image | null;
  location: string;
  longName: string;
  name: string;
  objectId: number;
  slug: string;
  smallName: string;
  town: Town;
}

export interface Country {
  abbreviation: string;
  id: number;
  name: string;
  objectId: number;
  shortName: string;
  slug: string;
}

export interface Image {
  caption: string;
  credit: null | string;
  height: number;
  id: number;
  longCaption: string;
  objectId: number;
  peerUrls: null;
  photographer: null | string;
  slug: string;
  url: string;
  width: number;
}

export interface Town {
  area: string;
  id: number;
  name: string;
  objectId: number;
  timezone: string;
}

export enum Language {
  Hi = 'hi',
  Ta = 'ta',
}

export enum ScheduleNote {
  A1VA2ReserveDayAvailable = 'A1 v A2 (Reserve day available)',
  A2VB1 = 'A2 v B1',
  Empty = '',
}

export interface Series {
  alternateName: null | string;
  description: string;
  endDate: Date;
  gamePlayWatch: boolean;
  hasStandings: boolean;
  id: number;
  isTrophy: boolean;
  longAlternateName: null | string;
  longName: string;
  name: string;
  objectId: number;
  scribeId: number;
  season: string;
  slug: string;
  standingsType: number;
  startDate: Date;
  totalVideos: number;
  typeId: number;
  unofficialName: null;
  year: number;
}

export enum Stage {
  Finished = 'FINISHED',
  Running = 'RUNNING',
  Scheduled = 'SCHEDULED',
}

export enum State {
  Live = 'LIVE',
  Post = 'POST',
  Pre = 'PRE',
}

export enum Status {
  Live = 'Live',
  MatchStartTime = '{{MATCH_START_TIME}}',
  NotCoveredLive = 'Not covered Live',
  Result = 'RESULT',
  Stumps = 'Stumps',
}

export interface TeamElement {
  captain: null;
  inningNumbers: number[];
  isHome: boolean;
  isLive: boolean;
  points: number | null;
  score: null | string;
  scoreInfo: null | string;
  sideBatsmen: null;
  sideFielders: null;
  sidePlayers: null;
  team: TeamTeam;
  teamOdds: TeamOdds | null;
}

export interface TeamTeam {
  abbreviation: string;
  id: number;
  image: Image | null;
  imageUrl: null | string;
  isCountry: boolean;
  longName: string;
  name: string;
  objectId: number;
  primaryColor: null | string;
  scribeId: number;
  slug: string;
  unofficialName: null | string;
}

export interface TeamOdds {
  odds: string;
  url: string;
}
