import type { IAward, ICertificate, IExperience, IArtwork, IHike, IItem, ILanguage, IMall, IModule, IMusic, ISkill, ITechnology, IMapQuiz, IGuessQuiz } from "../types/item";
import Item from "./item";
import Award from "./portfolio/award";
import allData from "@data/data";
import Certificate from "./portfolio/certificate";
import Experience from "./portfolio/experience";
import Language from "./portfolio/language";
import Module from "./portfolio/module";
import Skill from "./portfolio/skill";
import Technology from "./portfolio/technology";
import Artwork from "./portfolio/artwork";
import Music from "./portfolio/music";
import Hike from "./blog/hike";
import Mall from "./blog/mall";
import MapQuiz from "./quizzes/mapQuiz";
import GuessQuiz from "./quizzes/guessQuiz";

export function createItem(iitem: IItem): Item {
  switch (iitem.type) {
    case 'artwork':
      return new Artwork(iitem as IArtwork);
    case 'award':
      return new Award(iitem as IAward);
    case 'certificate':
      return new Certificate(iitem as ICertificate);
    case 'experience': 
      return new Experience(iitem as IExperience);
    case 'language':
      return new Language(iitem as ILanguage);
    case 'module':
      return new Module(iitem as IModule);
    case 'skill':
      return new Skill(iitem as ISkill);
    case 'technology':
      return new Technology(iitem as ITechnology);
    case 'music':
      return new Music(iitem as IMusic);
    case 'hike':
      return new Hike(iitem as IHike);
    case 'mall':
      return new Mall(iitem as IMall);
    case 'map':
      return new MapQuiz(iitem as IMapQuiz);
    case 'guess':
      return new GuessQuiz(iitem as IGuessQuiz);
    default:
      return new Item(iitem as IItem);
  }
}

var unsortedItems: Item[] = [];
export const allItemsDict: { [category: string]: { [type: string]: { [key: string]: Item } } } = {};
for (const [category, v] of Object.entries(allData)) {
  if (category === 'home') continue;
  const categoryData: Object = v.data;
  for (const [type, v] of Object.entries(categoryData)) {
    const typeData: Object = v.data;
    for (const [key, v] of Object.entries(typeData)) {
      const item = createItem({
        category, type, key, ...v });
      unsortedItems.push(item);
      if (!allItemsDict[category]) allItemsDict[category] = {};
      if (!allItemsDict[category][type]) allItemsDict[category][type] = {};
      allItemsDict[category][type][key] = item;
    }
  }
}

unsortedItems.sort((a, b) => (b.importance || 0) - (a.importance || 0));
export const allItems = unsortedItems;