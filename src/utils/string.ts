export const addEllipsis = (text: string, length: number) => {
  if (text.length <= length) return text;
  console.log(text);
  return text.slice(0, length) + '...';
}