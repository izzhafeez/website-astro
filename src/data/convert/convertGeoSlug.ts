import geoData from "../quizzes/geo.json";

const convertGeoSlug = (slug: string): string => {
    const splitted = slug.split('-');
    const L = splitted.length;
    if (L == 1 && (geoData as any)[splitted[0]]) return (geoData as any)[splitted[0]];
    if (L == 2) {
        const domain = convertDomain(splitted[0]);
        const rawPop = splitted[1];
        const isTop = rawPop[0] == "t";
        if (isTop) {
            const pop = parseInt(rawPop.substring(3));
            return `${domain} Top ${pop} Cities`;
        }
        const pop = parseInt(rawPop) / 1000;
        if (pop > 999) return `${domain} 1M Cities`;
        if (pop > 0) return `${domain} ${pop.toFixed(0)}k Cities`;

        if (domain == "World") return `${domain} 50k Cities`;
        if (domain == "Europe") return `${domain} 10k Cities`;
        if (domain == "North America") return `${domain} 10k Cities`;
        return `${domain} All Cities`;
    }
    if (L == 3) {
        const domain = convertDomain(splitted[0]);
        const sub = convertSub(splitted[1]);
        const rawPop = splitted[2];
        const isTop = rawPop[0] == "t";
        if (isTop) {
            const pop = parseInt(rawPop.substring(3));
            return `${domain} (${sub}) Top ${pop} Cities`;
        }
        const pop = parseInt(rawPop) / 1000;
        if (pop > 999) return `${domain} (${sub}) 1M Cities`;
        if (pop > 0) return `${domain} (${sub}) ${pop.toFixed(0)}k Cities`;

        if (domain == "World") return `${domain} (${sub}) 50k Cities`;
        if (domain == "Europe") return `${domain} (${sub}) 10k Cities`;
        if (domain == "North America") return `${domain} (${sub}) 10k Cities`;
        return `${domain} (${sub}) All Cities`;
    }
    return convertSub(slug);
};

const convertDomain = (domain: string): string => {
    switch (domain) {
        case 'us':
            return 'United States';
        case 'uk':
            return 'United Kingdom';
        case 'euro':
            return 'Europe';
        case 'na':
            return 'North America';
        default:
            return domain.charAt(0).toUpperCase() + domain.slice(1);
    }
}

const convertSub = (sub: string): string => {
    // capitalise first letter of each word
    const words = sub.replaceAll("_", " ").split(' ');
    const capitalisedWords = words.map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    });
    return capitalisedWords.join(' ');
};

export default convertGeoSlug;