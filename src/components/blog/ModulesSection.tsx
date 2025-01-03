import React, { type SetStateAction } from 'react';
import StarScale from './comments/StarScaleStatic';

type Mod = {
  title: string;
  semester: string;
  grade: string;
  review: string;
  fairness: number;
  retention: number;
  grindable: number;
  usefulness: number;
}

type ModData = {
  [key: string]: Mod
}

enum SortKey {
  grade = "grade",
  semester = "semester",
  code = "code",
  name = "name",
  fairness = "fairness",
  retention = "retention",
  grindable = "grindable",
  usefulness = "usefulness",
  overall = "overall"
}

const ModulesSection = ({ modData }: { modData: ModData }) => {
  const [sortKey, setSortKey] = React.useState<SortKey>(SortKey.grade);
  const [isAscending, setIsAscending] = React.useState<boolean>(false);

  const getScoreFromGrade = (grade: string) => {
    if (grade == "A+") return 5;
    if (grade == "A") return 4;
    if (grade == "A-") return 3;
    if (grade == "B+") return 2;
    if (grade == "B") return 1;
    return 0;
  }
  
  const getColorFromGrade = (grade: string) => {
    if (grade == "A+") return "bg-cr-500";
    if (grade == "A") return "bg-ew-500";
    if (grade == "A-") return "bg-cc-500";
    if (grade == "B+" || grade == "B") return "bg-ns-500";
    return "bg-black";
  }

  const neon = 'hover:neon-cc hover:border-cc-500/70';
  const text = 'group-hover:text-cc-500 dark:group-hover:text-cc-300';

  const getTotalScore = (mod: Mod) => mod.fairness + mod.retention + mod.grindable + mod.usefulness;

  const sortByGrade = (a: [string, Mod], b: [string, Mod]) => getScoreFromGrade(b[1].grade) - getScoreFromGrade(a[1].grade);
  const sortBySemester = (a: [string, Mod], b: [string, Mod]) => a[1].semester.localeCompare(b[1].semester);
  const sortByCode = (a: [string, Mod], b: [string, Mod]) => -a[0].localeCompare(b[0]);
  const sortByName = (a: [string, Mod], b: [string, Mod]) => -a[1].title.localeCompare(b[1].title);
  const sortByFairness = (a: [string, Mod], b: [string, Mod]) => b[1].fairness - a[1].fairness;
  const sortByRetention = (a: [string, Mod], b: [string, Mod]) => b[1].retention - a[1].retention;
  const sortByGrindable = (a: [string, Mod], b: [string, Mod]) => b[1].grindable - a[1].grindable;
  const sortByUsefulness = (a: [string, Mod], b: [string, Mod]) => b[1].usefulness - a[1].usefulness;
  const sortByOverall = (a: [string, Mod], b: [string, Mod]) => getTotalScore(b[1]) - getTotalScore(a[1]);
  const sortUndefinedLast = (attribute: string, fn: (a: [string, Mod], b: [string, Mod]) => number) => (a: [string, Mod], b: [string, Mod]) => {
    if ((a[1] as {[attribute: string]: any})[attribute] == undefined) return 1;
    if ((b[1] as {[attribute: string]: any})[attribute] == undefined) return -1;
    return fn(a, b);
  }
  const sortKeys = {
    grade: !isAscending ? sortByGrade : (a: [string, Mod], b: [string, Mod]) => -sortByGrade(a, b),
    semester: !isAscending ? sortBySemester : (a: [string, Mod], b: [string, Mod]) => -sortBySemester(a, b),
    code: !isAscending ? sortByCode : (a: [string, Mod], b: [string, Mod]) => -sortByCode(a, b),
    name: !isAscending ? sortByName : (a: [string, Mod], b: [string, Mod]) => -sortByName(a, b),
    fairness: !isAscending ? sortUndefinedLast('fairness', sortByFairness) : sortUndefinedLast('fairness', (a: [string, Mod], b: [string, Mod]) => -sortByFairness(a, b)),
    retention: !isAscending ? sortUndefinedLast('retention', sortByRetention) : sortUndefinedLast('retention', (a: [string, Mod], b: [string, Mod]) => -sortByRetention(a, b)),
    grindable: !isAscending ? sortUndefinedLast('grindable', sortByGrindable) : sortUndefinedLast('grindable', (a: [string, Mod], b: [string, Mod]) => -sortByGrindable(a, b)),
    usefulness: !isAscending ? sortUndefinedLast('usefulness', sortByUsefulness) : sortUndefinedLast('usefulness', (a: [string, Mod], b: [string, Mod]) => -sortByUsefulness(a, b)),
    overall: !isAscending ? sortByOverall : (a: [string, Mod], b: [string, Mod]) => -sortByOverall(a, b),
  }
  
  const sortedCourses = Object.entries(modData).sort(sortKeys[sortKey]);

  const isRating = (key: string) => key == "fairness" || key == "retention" || key == "grindable" || key == "usefulness";

  return <div className="max-w-6xl mx-auto">
    {/* change sort key */}
    <div className="flex p-4">
      <select className="cursor-pointer bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-500/20 rounded-md p-2" onChange={(e) => setSortKey(e.target.value as SetStateAction<SortKey>)}>
        <option value={SortKey.grade}>Sort by Grade</option>
        <option value={SortKey.semester}>Sort by Semester</option>
        <option value={SortKey.code}>Sort by Code</option>
        <option value={SortKey.name}>Sort by Name</option>
        <option value={SortKey.fairness}>Sort by Fairness</option>
        <option value={SortKey.retention}>Sort by Retention</option>
        <option value={SortKey.grindable}>Sort by Grindability</option>
        <option value={SortKey.usefulness}>Sort by Usefulness</option>
      </select>
      <button className="bg-cc-500 text-white p-2 rounded-md ms-2" onClick={() => setIsAscending(!isAscending)}>
        {isAscending ? "↑" : "↓"}
      </button>
    </div>

    {/* display */}
    <section id="review-container" className="my-auto grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 relative px-2 mt-2">
      {sortedCourses.map(([key, value]) => <a href={`/blog/mod-reviews/${key}`} role="button" className={`${neon} p-4 rounded-lg group border-[1px] border-cc-500/0 transition duration-500`} data-pagefind-ignore="all">
        <div className="flex">
          <h2 className={`font-medium ${text}`}>{key} ({isRating(sortKey) ? StarScale((value as {[key: string]: any})[sortKey]) : value.grade})</h2>
          {<span className={`w-2 h-2 rounded-md my-auto ms-2 ${getColorFromGrade(value.grade)}`}></span>}
          <span className="bg-tw-mrt"></span>
          <span className="bg-hp-mrt"></span>
          <span className="bg-lrt-mrt"></span>
          <span className="bg-mp-mrt"></span>
        </div>
        <p className="text-gray-500 text-sm">{value.title}</p>
      </a>)}
    </section>
  </div>
}

export default ModulesSection;