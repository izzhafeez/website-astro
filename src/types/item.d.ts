export interface IItem {
  category: string;
  type: string;
  key: string;
  title: string;
  imgPath: string;
  importance: number;
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

export interface IGraph extends IItem {
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

export interface IHikePost extends IItem {
  date: string;
  start: string;
  end: string;
  color: string;
}

export interface IMallPost extends IItem {
  
}