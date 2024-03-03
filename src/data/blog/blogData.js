import hikesData from './json/hike.json';
import mallsData from './json/mall.json';

const blogData = {
  mall: {
    data: mallsData,
    limit: 7,
    description: "The malls with icons below are the ones I have visited. These pictures are also used when creating my <</portfolio/coding/malls-of-singapore>>card game</>. So do check them out!"
  },
  hike: {
    data: hikesData,
    limit: 5,
    description: "Hikes hikes hikes"
  }
};

export default blogData;