import React from 'react';

type Hike = {
  name: string,
  date: string,
  color: string,
  victims: number,
  rating: number,
  route: string,
  experience: string,
  refreshments: string,
  tips: string,
  distance: number,
}

type HikeData = {
  [key: string]: Hike
}

enum SortKey {
  distance = "distance",
  date = "date",
  name = "name",
  rating = "rating",
}

const HikesSection = ({ hikeData }: { hikeData: HikeData }) => {
  const [sortKey, setSortKey] = React.useState<SortKey>(SortKey.distance);
  const [isAscending, setIsAscending] = React.useState<boolean>(false);

  const neon = 'hover:neon-cc hover:border-cc-500/70';
  const text = 'group-hover:text-cc-500 dark:group-hover:text-cc-300';

  const sortByDistance = (a: [string, Hike], b: [string, Hike]) => {
    return a[1].distance - b[1].distance;
  }

  const sortByDate = (a: [string, Hike], b: [string, Hike], isAscending: boolean) => {
    if (a[1].date == "TBD") return 1;
    if (b[1].date == "TBD") return -1;
    const [d1, m1, y1] = a[1].date.split("/");
    const [d2, m2, y2] = b[1].date.split("/");
    let compare;
    if (y1 != y2) compare = parseInt(y1) - parseInt(y2);
    else if (m1 != m2) compare = parseInt(m1) - parseInt(m2);
    else compare = parseInt(d1) - parseInt(d2);
    return isAscending ? compare : -compare;
  }

  const sortByName = (a: [string, Hike], b: [string, Hike]) => {
    return a[1].name.localeCompare(b[1].name);
  }

  const sortByRating = (a: [string, Hike], b: [string, Hike], isAscending: boolean) => {
    if (a[1].date == "TBD") return 1;
    if (b[1].date == "TBD") return -1;
    return isAscending ? a[1].rating - b[1].rating : b[1].rating - a[1].rating;
  }

  const sortKeys = {
    [SortKey.distance]: isAscending ? sortByDistance : (a: [string, Hike], b: [string, Hike]) => -sortByDistance(a, b),
    [SortKey.date]: (a: [string, Hike], b: [string, Hike]) => sortByDate(a, b, isAscending),
    [SortKey.name]: isAscending ? sortByName : (a: [string, Hike], b: [string, Hike]) => -sortByName(a, b),
    [SortKey.rating]: (a: [string, Hike], b: [string, Hike]) => sortByRating(a, b, isAscending),
  }
  
  const sortedHikes = Object.entries(hikeData).sort(sortKeys[sortKey]);

  return <div className="max-w-6xl mx-auto">
    {/* change sort key */}
    <div className="flex p-4 mt-4">
      <select className="cursor-pointer bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-500/20 rounded-md p-2" onChange={(e) => setSortKey(e.target.value)}>
        <option value={SortKey.distance}>Sort by Distance</option>
        <option value={SortKey.rating}>Sort by Rating</option>
        <option value={SortKey.date}>Sort by Date</option>
        <option value={SortKey.name}>Sort by Name</option>
      </select>
      <button className="bg-cc-500 text-white p-2 rounded-md ms-2" onClick={() => setIsAscending(!isAscending)}>
        {isAscending ? "↑" : "↓"}
      </button>
    </div>

    {/* display */}
    <section id="review-container" className="my-auto grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 relative px-2 mt-2">
      {sortedHikes.map(([key, value]) => <a href={`/blog/hikes/${key}`} role="button" className={`${neon} p-4 rounded-lg group border-[1px] border-cc-500/0 transition duration-500`} data-pagefind-ignore="all">
        <div className="flex">
          <h2 className={`font-medium ${text}`}>{`${value.name}`}</h2>
          <span className={`w-2 h-2 rounded-md my-auto ms-2 bg-${value.color}`}></span>
          <span className="bg-dt-500"></span>
          <span className="bg-te-500"></span>
          <span className="bg-cr-500"></span>
          <span className="bg-sl-500"></span>
          <span className="bg-tw-500"></span>
          <span className="bg-hp-500"></span>
          <span className="bg-lrt-500"></span>
          <span className="bg-mp-500"></span>
          <span className="bg-black/50"></span>
        </div>
        <p className="text-gray-500 text-sm">{`${value.date} | ${value.distance.toFixed(2)}km`}</p>
      </a>)}
    </section>
  </div>
}

export default HikesSection;