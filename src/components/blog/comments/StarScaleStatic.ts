const StarScale = (value: number) => {
  const stars = [1, 2, 3, 4, 5];
  const fullStar = '★';
  const emptyStar = '☆';
  return stars.map((star) => star <= value ? fullStar : emptyStar);
}

export default StarScale;