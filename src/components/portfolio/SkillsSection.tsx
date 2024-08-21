import React from "react";

const SkillsSection = ({ data }: { data: {[key: string]: string} }) => {
  const [sections, setSections] = React.useState<{[key: string]: boolean}>({
    "Software Engineering": true,
    "Data Science": true,
    "Music": true,
    "Soft Skills": true,
    "Mathematics": true
  });

  const getColorFromCategory = (category: string) => {
    switch (category) {
      case "Software Engineering":
        return "border-ew-500";
      case "Data Science": 
        return "border-ns-500";
      case "Music": 
        return "border-ne-500";
      case "Soft Skills":
        return "border-cc-500";
      case "Mathematics":
        return "border-dt-500";
    }
  };

  const handleClick = (section: string) => {
    console.log(section);
    setSections({
      ...sections,
      [section]: !sections[section]
    });
  };

  return <section className="flex flex-wrap mx-auto max-w-3xl gap-2 content-center">
    <span className={`cursor-pointer p-2 ${sections['Software Engineering'] ? 'bg-ew-500 border-gray-300/20' : 'border-ew-500'} text-white border-2 rounded-md`} onClick={() => handleClick("Software Engineering")}>Software Engineering</span>
    <span className={`cursor-pointer p-2 ${sections['Data Science'] ? 'bg-ns-500 border-gray-300/20' : 'border-ns-500'} text-white border-2 rounded-md`} onClick={() => handleClick("Data Science")}>Data Science</span>
    <span className={`cursor-pointer p-2 ${sections['Music'] ? 'bg-ne-500 border-gray-300/20' : 'border-ne-500'} text-white border-2 rounded-md`} onClick={() => handleClick("Music")}>Music</span>
    <span className={`cursor-pointer p-2 ${sections['Soft Skills'] ? 'bg-cc-500 border-gray-300/20' : 'border-cc-500'} text-white border-2 rounded-md`} onClick={() => handleClick("Soft Skills")}>Soft Skills</span>
    <span className={`cursor-pointer p-2 ${sections['Mathematics'] ? 'bg-dt-500 border-gray-300/20' : 'border-dt-500'} text-white border-2 rounded-md`} onClick={() => handleClick("Mathematics")}>Mathematics</span>
    {Object.entries(data).filter(([skill, category]) => sections[category]).map(([skill, category]) => <span className={`p-2 bg-white/50 dark:bg-gray-700/50 border-2 ${getColorFromCategory(category)} rounded-md`}>{skill}</span>)}
  </section>
}

export default SkillsSection;