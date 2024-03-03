import artworkData from './json/artwork.json';
import awardsData from './json/award.json';
import certificatesData from './json/certificate.json';
import experiencesData from './json/experience.json';
import languagesData from './json/language.json';
import modulesData from './json/module.json';
import musicData from './json/music.json';
import skillsData from './json/skill.json';
import technologiesData from './json/technology.json';

const portfolioData = {
  artwork: {
    data: artworkData,
    limit: 7,
    description: "I started using Desmos in 2017, where it became a major time sink throughout my JC years. Indeed, instead of studying, I would be playing around in Desmos and trying to develop my own equations and graphing techniques. This has led me to win the <<../portfolio/award/ti-competition>>Gold Award for the graphing competition by Texas Instruments</>.\nThese are the graphs that I've been bothered to include in this website. They are sorted by how significant they were to my Desmos journey, so you can see the more important ones on top. The stars, on the other hand, represent how complex the artwork was, and how difficult it was to create."
  },
  award: {
    data: awardsData,
    limit: 5,
    description: "Welcome to my Awards Page! Here, I share some of the achievements that I've received throughout my school life. Although I have participated in some other competitions, most of my note-worthy achievements are math-related."
  },
  certificate: {
    data: certificatesData,
    limit: 5,
    description: "These are some of the certificates and tests that I have taken over the years. I took quite a few programming-related courses before entering university, which gave me a decent foundation coming into Computer Science. Besides those, I have also taken quite a few language tests, which are the HSK and JLPT tests. For the HSK, I've managed to pass the <</portfolio/certificate/hsk-5>>HSK 5</> test with a decent score. However, I failed the <</portfolio/certificate/hsk-6>>HSK 6</> test, as well as the <</portfolio/certificate/jlpt-n3>>JLPT N3</> test. Now, I don't think I have the time to revise for the tests, so these pursuits are put on hold."
  },
  experience: {
    data: experiencesData,
    limit: 3,
    description: 'Welcome to my Experiences Page! Here I share the times that I applied my programming knowledge in a professional sense, be it in internships or work. The most notable one was my two-year stint in <</portfolio/experience/data-analytics>>Data Analytics</>, where my time was spent most fruitfully.'
  },
  language: {
    data: languagesData,
    limit: 7,
    description: "These are the programming and spoken languages I've learnt over the years, along with how proficient I think I am at them. It is to be noted that my conversational skills are almost non-existent, as I mainly focus on understanding patterns in vocab and grammar."
  },
  module: {
    data: modulesData,
    limit: 5,
    description: "These are the courses that I've taken in university (a Double Major in Computer Science and Mathematics). My current GPA is 4.87, though I think it will take a massive hit this coming year."
  },
  music: {
    data: musicData,
    limit: 7,
    description: "I started using MuseScore and Synthesia in 2019, where I started covering songs on piano. As my skills developed, I gradually produced better and better covers, learning from my mistakes as I go along.\nBTW, this is not even close to half of the songs I've covered over the years. It takes quite a long time to process these into PDF and MP3 files, so I didn't go all out on this section."
  },
  skill: {
    data: skillsData,
    limit: 7,
    description: "These are the technical skills that I've acquired over the years. Many of them are related to <</portfolio/skill/data-science>>Data Science</>, largely thanks to my time in <</portfolio/experience/data-analytics>>SCDF</>."
  },
  technology: {
    data: technologiesData,
    limit: 7,
    description: "These are the frameworks, tools and software that I have learnt over the years, along with how proficient I think I am at them."
  },
};

export default portfolioData;