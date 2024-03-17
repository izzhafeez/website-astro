interface TagsProps {
  tags: string[];
  site: string;
}

const Tag = ({ tags=[], site }: TagsProps) => {
  let tagColor = "text-gray-500 dark:text-gray-300 bg-gray-300/20 hover:bg-gray-300/40";
  switch (site) {
    case 'portfolio':
      tagColor = "text-ew-500 dark:text-ew-300 bg-ew-300/20 hover:bg-ew-300/40";
      break;
    case 'quizzes':
      tagColor = "text-ns-500 dark:text-ns-300 bg-ns-300/20 hover:bg-ns-300/40";
      break;
  }

  return (
    <div className="flex flex-wrap gap-1 my-2">{tags.map((tag: string) => <span className={`${tagColor} text-xs rounded-full px-2 py-1`}>{tag}</span>)}</div>
  );
};

export default Tag;