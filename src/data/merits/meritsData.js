import awardsData from './json/awards.json';
import certificatesData from './json/certificates.json';
import coursesData from './json/courses.json';
import experiencesData from './json/experiences.json';
import languagesData from './json/languages.json';
import modulesData from './json/modules.json';
import skillsData from './json/skills.json';
import technologiesData from './json/technologies.json';

const meritsData = {
  awards: {
    data: awardsData,
    limit: 5,
    description: "Welcome to my Awards Page! Here, I share some of the achievements that I've received throughout my school life. Although I have participated in some other competitions, most of my note-worthy achievements are math-related."
  },
  certificates: {
    data: certificatesData,
    limit: 5,
    description: "These are some of the certificates and tests that I have taken over the years. I took quite a few programming-related courses before entering university, which gave me a decent foundation coming into Computer Science. Besides those, I have also taken quite a few language tests, which are the HSK and JLPT tests. For the HSK, I've managed to pass the <<../merits/certificates/hsk-5>>HSK 5</> test with a decent score. However, I failed the <<../merits/certificates/hsk-6>>HSK 6</> test, as well as the <<../merits/certificates/jlpt-n3>>JLPT N3</> test. Now, I don't think I have the time to revise for the tests, so these pursuits are put on hold."
  },
  courses: {
    data: coursesData,
    limit: 5,
    description: "These are the individual courses that I've taken as part of my pursuit of <<../merits/certificates>>certificates</>."
  },
  experiences: {
    data: experiencesData,
    limit: 3,
    description: 'Welcome to my Experiences Page! Here I share the times that I applied my programming knowledge in a professional sense, be it in internships or work. The most notable one was my two-year stint in <<../merits/experiences/data-analytics>>Data Analytics</>, where my time was spent most fruitfully.'
  },
  languages: {
    data: languagesData,
    limit: 7,
    description: "These are the programming and spoken languages I've learnt over the years, along with how proficient I think I am at them. It is to be noted that my conversational skills are almost non-existent, as I mainly focus on understanding patterns in vocab and grammar."
  },
  modules: {
    data: modulesData,
    limit: 5,
    description: "These are the courses that I've taken in university (a Double Major in Computer Science and Mathematics). My current GPA is 4.87, though I think it will take a massive hit this coming year."
  },
  skills: {
    data: skillsData,
    limit: 7,
    description: "These are the technical skills that I've acquired over the years. Many of them are related to <<../merits/skills/data-science>>Data Science</>, largely thanks to my time in <<../merits/experiences/data-analytics>>SCDF</>."
  },
  technologies: {
    data: technologiesData,
    limit: 7,
    description: "These are the frameworks, tools and software that I have learnt over the years, along with how proficient I think I am at them."
  },
};

export default meritsData;