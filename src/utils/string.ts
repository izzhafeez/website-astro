import slug from 'limax';

export const addEllipsis = (text: string, length: number) => {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export const sanitise = (text: string) => {
  const unascii = slug(text);
  const searchTermsMatches = /\[(.*?)\]/gi.exec(unascii);
  var searchTerms: string[] = [];
  if (!!searchTermsMatches) searchTerms = searchTermsMatches[0].split(",").map(term => term.trim().replace(/\[|\]/g, ''))

  return {
    searchTerms,
    cleanText: text.replace(/\[.*?\]/g, '')
  }
}

export const fullSanitise = (text: string) => {
  const { searchTerms, cleanText } = sanitise(text);

  return {
    searchTerms,
    cleanText,
    key: cleanText
      .replace(/\[.*?\]/g, '')
      .replace(/\([^)]*\)/g, '')
      .replaceAll(' ', '')
      .toLowerCase()
      .replace(/[^0-9a-z]/gi, '')
      .replace('school', '')
      .replace('saint', 'st')
  }
}