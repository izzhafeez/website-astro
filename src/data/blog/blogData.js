import hikesData from './json/hikes.json';
import mallsData from './json/malls.json';

const blogData = {
  malls: {
    data: mallsData,
    limit: 7,
    description: "The malls with icons below are the ones I have visited. These pictures are also used when creating my <<../projects/coding/malls-of-singapore>>card game</>. So do check them out!"
  },
  hikes: {
    data: hikesData,
    limit: 5,
    description: "Hikes hikes hikes"
  }
};

export default blogData;