export interface QuranInfo {
  verses: Verses;
  chapters: Chapter[];
  sajdas: Sajdas;
  rukus: Rukus;
  pages: Pages;
  manzils: Manzils;
  maqras: Maqras;
  juzs: Juzs;
}

interface Juzs {
  count: number;
  references: Reference6[];
}

interface Reference6 {
  juz: number;
  start: Start;
  end: Start;
}

interface Maqras {
  count: number;
  references: Reference5[];
}

interface Reference5 {
  maqra: number;
  start: Start;
  end: Start;
}

interface Manzils {
  count: number;
  references: Reference4[];
}

interface Reference4 {
  manzil: number;
  start: Start;
  end: Start;
}

interface Pages {
  count: number;
  references: Reference3[];
}

interface Reference3 {
  page: number;
  start: Start;
  end: Start;
}

interface Rukus {
  count: number;
  references: Reference2[];
}

interface Reference2 {
  ruku: number;
  start: Start;
  end: Start;
}

interface Start {
  chapter: number;
  verse: number;
}

interface Sajdas {
  count: number;
  references: Reference[];
}

interface Reference {
  sajda: number;
  chapter: number;
  verse: number;
  recommended: boolean;
  obligatory: boolean;
}

export interface Chapter {
  chapter: number;
  name: string;
  englishname: string;
  arabicname: string;
  revelation: string;
  verses: Verse[];
}

interface Verse {
  verse: number;
  line: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  maqra: number;
  sajda: Sajda | boolean | boolean;
}

interface Sajda {
  no: number;
  recommended: boolean;
  obligatory: boolean;
}

interface Verses {
  count: number;
}

export interface ChapterDetail {
  arabic: Info;
  transcription: Info;
  translation: Info;
}

interface Info {
  chapter: VerseInfo[];
}

export interface VerseInfo {
  chapter: number;
  verse: number;
  text: string;
}

export interface LanguageList {
  name: string;
  author: string;
  language: string;
  direction: string;
  source: string;
  comments: string;
  link: string;
  linkmin: string;
}
