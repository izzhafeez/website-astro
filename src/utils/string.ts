import slug from 'limax';

export const addEllipsis = (text: string, length: number) => {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

export const capitalise = (text: string) => text.split(" ").map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(' ');

export const toName = (key: string) => key.split('-').map(capitalise).join(' ');

export const sanitise = (text: string) => {
  const searchTermsMatches = /\[[^\]]*\]/gi.exec(text);
  var searchTerms: string = '';
  if (!!searchTermsMatches) searchTerms = searchTermsMatches[0];
  return {
    searchTerms: searchTerms, // []
    cleanText: text.replace(/\[.*?\]/g, '') // with ()
  }
}

export const fullSanitise = (text: string) => {
  const { searchTerms, cleanText } = sanitise(text);

  return {
    searchTerms,
    cleanText,
    key: slug(text
      .replace(/\[.*?\]/g, '')
      .replace(/\([^)]*\)/g, ''))
      .replaceAll(' ', '')
      .toLowerCase()
      .split(',')[0]
      .replace(/[^0-9a-z]/gi, '') // without ()[]
  }
}

export function stringToHash(s: string) {
  return s.split('').reduce((hash, char) => {
      return char.charCodeAt(0) + (hash << 6) + (hash << 16) - hash;
  }, 0);
}
