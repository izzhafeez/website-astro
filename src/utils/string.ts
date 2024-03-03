export const addEllipsis = (text: string, length: number) => {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);