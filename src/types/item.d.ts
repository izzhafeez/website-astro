export interface IItem {
  category: string;
  type: string;
  key: string;
  title: string;
  imgPath: string;
  importance: number;
  description: TDescription;
  related: string[];
}

export interface IAward extends IItem {
  date: string;
  level: string;
  link: string;
}

export interface ICertificate extends IItem {
  date: string;
  issuer: string;
  link: string;
}

export interface IExperience extends IItem {
  startDate: string;
  endDate: string;
  organisation: string;
  overview: string;
}

export interface ILanguage extends IItem {
  proficiency: number;
  date: string;
}

export interface IModule extends IItem {
  name: string;
  semester: string;
  grade: string;
}

export interface ISkill extends IItem {
  proficiency: number;
}

export interface ITechnology extends IItem {
  proficiency: number;
}

export interface ICoding extends IItem {
  date: string;
  overview: string;
  repo: string;
}

export interface IArtwork extends IItem {
  complexity: number;
  link: string;
}

export interface IMusic extends IItem {
  artist: string;
  link: string;
}

export interface IQuiz extends IItem {
  link: string;
}

export interface Stop {
  lat: number,
  lng: number,
  name: string
}

export interface IHike extends IItem {
  date: string;
  start: string;
  end: string;
  color: string;
  stops: Stop[];
}

export interface IMall extends IItem {
  latitude: number,
  longitude: number,
  stores: number;
  floors: number;
  year: number;
  area: number;
}

export interface IMapQuiz extends IItem {
  data: {[key: string]: number[][]}
}

export interface IGuessQuiz extends IItem {
  data: {[key: string]: string}
}

export type TDescriptionBlock = {
  title?: string,
  text: string
}

export type TDescription = TDescriptionBlock[];