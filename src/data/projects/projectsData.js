import codingData from './json/coding.json';
import graphsData from './json/graphs.json';
import musicData from './json/music.json';
import quizzesData from './json/quizzes.json';

const projectsData = {
  coding: {
    data: codingData,
    limit: 3,
    description: "I've always enjoyed creating my own things, which was why programming was an outlet for me to be creative. It sounds cliche, yes, but that's just how it is.\nI always push myself to learn new technologies, having the 'Why not' mindset when choosing my stack."
  },
  music: {
    data: musicData,
    limit: 7,
    description: "I started using MuseScore and Synthesia in 2019, where I started covering songs on piano. As my skills developed, I gradually produced better and better covers, learning from my mistakes as I go along.\nBTW, this is not even close to half of the songs I've covered over the years. It takes quite a long time to process these into PDF and MP3 files, so I didn't go all out on this section."
  },
  graphs: {
    data: graphsData,
    limit: 7,
    description: "I started using Desmos in 2017, where it became a major time sink throughout my JC years. Indeed, instead of studying, I would be playing around in Desmos and trying to develop my own equations and graphing techniques. This has led me to win the <<../merits/awards/ti-competition>>Gold Award for the graphing competition by Texas Instruments</>.\nThese are the graphs that I've been bothered to include in this website. They are sorted by how significant they were to my Desmos journey, so you can see the more important ones on top. The stars, on the other hand, represent how complex the artwork was, and how difficult it was to create."
  },
  quizzes: {
    data: quizzesData,
    limit: 5,
    description: "I mostly create geography quizzes, so the ones you'll find below are posted either on Jetpunk, or Geoguessr. I plan on releasing more, when I have the time to do it."
  }
};

export default projectsData;