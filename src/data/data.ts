import blogData from "./blog";
import portfolioData from "./portfolio";
import quizData from "./quizzes";

const allData: {[key: string]: {data: {[key2: string]: {description: string}}, description: string}} = {
  portfolio: {
    data: portfolioData,
    description: "Here are some of the things I've done and achieved at various stages of my life."
  },
  blog: {
    data: blogData,
    description: "Welcome to my Blog! Here is where I document some of the experiences I've gathered over the years. To give an overview of what I'll be sharing:\nI have visited over 150 <</blog/mall>>Malls</>, so these are the pictures I took and my thoughts on them."
  },
  quiz: {
    data: quizData,
    description: "Welcome to my quizzes",
  }
};

export default allData;