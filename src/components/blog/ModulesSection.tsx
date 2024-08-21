import React from 'react';

type Mod = {
  title: string;
  semester: string;
  grade: string;
  review: string;
}

type ModData = {
  [key: string]: Mod
}

enum SortKey {
  grade = "grade",
  semester = "semester",
  code = "code",
  name = "name"
}

const ModulesSection = ({ modData }: { modData: ModData }) => {
  const [sortKey, setSortKey] = React.useState<SortKey>(SortKey.grade);
  const [isAscending, setIsAscending] = React.useState<boolean>(true);

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

  const sortByGrade = (a: [string, Mod], b: [string, Mod]) => getScoreFromGrade(b[1].grade) - getScoreFromGrade(a[1].grade);
  const sortBySemester = (a: [string, Mod], b: [string, Mod]) => a[1].semester.localeCompare(b[1].semester);
  const sortByCode = (a: [string, Mod], b: [string, Mod]) => a[0].localeCompare(b[0]);
  const sortByName = (a: [string, Mod], b: [string, Mod]) => a[1].title.localeCompare(b[1].title);
  const sortKeys = {
    grade: isAscending ? sortByGrade : (a: [string, Mod], b: [string, Mod]) => -sortByGrade(a, b),
    semester: isAscending ? sortBySemester : (a: [string, Mod], b: [string, Mod]) => -sortBySemester(a, b),
    code: isAscending ? sortByCode : (a: [string, Mod], b: [string, Mod]) => -sortByCode(a, b),
    name: isAscending ? sortByName : (a: [string, Mod], b: [string, Mod]) => -sortByName(a, b),
  }
  
  const sortedCourses = Object.entries(modData).sort(sortKeys[sortKey]);

  return <div className="max-w-6xl mx-auto">
    {/* change sort key */}
    <div className="flex p-4">
      <select className="cursor-pointer bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-500/20 rounded-md p-2" onChange={(e) => setSortKey(e.target.value)}>
        <option value={SortKey.grade}>Sort by Grade</option>
        <option value={SortKey.semester}>Sort by Semester</option>
        <option value={SortKey.code}>Sort by Code</option>
        <option value={SortKey.name}>Sort by Name</option>
      </select>
      <button className="bg-cc-500 text-white p-2 rounded-md ms-2" onClick={() => setIsAscending(!isAscending)}>
        {isAscending ? "↑" : "↓"}
      </button>
    </div>

    {/* display */}
    <section id="review-container" className="my-auto grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 relative px-2 mt-2">
      {sortedCourses.map(([key, value]) => <a href={`/blog/mod-reviews/${key}`} role="button" className={`${neon} p-4 rounded-lg group border-[1px] border-cc-500/0 transition duration-500`} data-pagefind-ignore="all">
        <div className="flex">
          <h2 className={`font-medium ${text}`}>{`${key} (${value.grade})`}</h2>
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