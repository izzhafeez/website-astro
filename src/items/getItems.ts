import type { IAward, ICertificate, ICoding, IExperience, IGraph, IHike, IItem, ILanguage, IMall, IMusic, IQuiz, ISkill, ITechnology } from "../types/item";
import Item from "./item";
import Award from "./merits/award";
import allData from "@data/data";
import Certificate from "./merits/certificate";
import Experience from "./merits/experience";
import Language from "./merits/language";
import Module from "./merits/module";
import Skill from "./merits/skill";
import Technology from "./merits/technology";
import Coding from "./projects/coding";
import Graph from "./projects/graph";
import Music from "./projects/music";
import Quiz from "./projects/quiz";
import Hike from "./blog/hike";
import Mall from "./blog/mall";

export function createItem(iitem: IItem): Item {
  switch (iitem.type) {
    case 'awards':
      return new Award(iitem as IAward);
    case 'certificates':
      return new Certificate(iitem as ICertificate);
    case 'experiences': 
      return new Experience(iitem as IExperience);
    case 'languages':
      return new Language(iitem as ILanguage);
    case 'modules':
      return new Module(iitem as IModule);
    case 'skills':
      return new Skill(iitem as ISkill);
    case 'technologies':
      return new Technology(iitem as ITechnology);
    case 'coding':
      return new Coding(iitem as ICoding);
    case 'graphs':
      return new Graph(iitem as IGraph);
    case 'music':
      return new Music(iitem as IMusic);
    case 'quizzes':
      return new Quiz(iitem as IQuiz);
    case 'hikes':
      return new Hike(iitem as IHike);
    case 'malls':
      return new Mall(iitem as IMall);
    default:
      return new Item(iitem as IItem);
  }
}

export var allItems: Item[] = [];
for (const [category, v] of Object.entries(allData)) {
  if (category === 'home') continue;
  const categoryData: Object = v.data;
  for (const [type, v] of Object.entries(categoryData)) {
    const typeData: Object = v.data;
    for (const [key, v] of Object.entries(typeData)) {
      const item = createItem({
        category, type, key, ...v });
      allItems.push(item);
    }
  }
}

allItems = allItems.sort((a, b) => b.importance - a.importance);