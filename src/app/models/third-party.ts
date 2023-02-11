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
