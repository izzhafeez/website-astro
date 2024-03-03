const getStarScale = (value: number): string =>  {
  const emptyStar = '☆';
  const fullStar = '★';
  const fullStarCount = Math.ceil(value / 2);
  const emptyStarCount = 5 - fullStarCount;
  return fullStar.repeat(fullStarCount) + emptyStar.repeat(emptyStarCount);
};

export default getStarScale;