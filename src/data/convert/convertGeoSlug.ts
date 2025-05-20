import { capitalise } from "../../utils/string";
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
        if (pop > 999) return `${domain} ${(pop/1000).toFixed(0)}M Cities`;
        if (pop > 0) return `${domain} ${pop.toFixed(0)}k Cities`;

        if (domain == "World") return `${domain} 50k Cities`;
        if (domain == "Europe") return `${domain} 10k Cities`;
        if (domain == "North America") return `${domain} 10k Cities`;
        return `${domain} All Cities`;
    }
    if (L >= 3) {
        const domain = convertDomain(splitted[0]);
        let sub = splitted.slice(1, L - 1).map(convertSub).join(", ");

        sub = {
            SPA: "Spain", TUR: "Turkey", RUS: "Russia", GBR: "United Kingdom", GER: "Germany",
            GRE: "Greece", UKR: "Ukraine", ITA: "Italy", FRA: "France", POL: "Poland",
            SWE: "sweden", BLG: "belgium", NET: "netherlands", SWI: "switzerland", AUS: "austria",
            BUL: "bulgaria", CZE: "czechia", HUN: "hungary", ROM: "romania", NOR: "norway",
            SER: "serbia", FIN: "finland", POR: "portugal", DEN: "denmark", SVN: "slovenia",
            MAL: "malta", EST: "estonia", LIT: "lithuania", LAT: "latvia", IRE: "ireland",
            LUX: "luxembourg", ISL: "iceland", AND: "andorra", MON: "montenegro", MLT: "malta",
            CRO: "croatia", SVK: "slovakia", BOS: "bosnia and herzegovina", ALB: "albania",
            MOL: "Moldova", MAC: "North Macedonia", KOS: "Kosovo", BEL: "Belarus", AZE: "Azerbaijan",
            CYP: "Cyprus", WY: "Wyoming", NE: "Nebraska", NM: "New Mexico", KS: "Kansas",
            ID: "Idaho", HI: "Hawaii", ME: "Maine", RI: "Rhode Island", VT: "Vermont",
            ND: "North Dakota", SD: "South Dakota", MT: "Montana", DE: "Delaware",
            AK: "Alaska", WV: "West Virginia", NH: "New Hampshire", MS: "Mississippi",
            MI: "Michigan", IA: "Iowa", CT: "Connecticut", OR: "Oregon", SC: "South Carolina",
            KY: "Kentucky", LA: "Louisiana", AR: "Arkansas", TN: "Tennessee", MO: "Missouri",
            IN: "Indiana", OH: "Ohio", IL: "Illinois", WI: "Wisconsin", PA: "Pennsylvania",
            NC: "North Carolina", VA: "Virginia", GA: "Georgia", FL: "Florida", TX: "Texas",
            CA: "California", WA: "Washington", NY: "New York", NJ: "New Jersey", MA: "Massachusetts",
            MD: "Maryland", CO: "Colorado", UT: "Utah", AZ: "Arizona", MN: "Minnesota",
            AL: "Alabama", OK: "Oklahoma", NV: "Nevada"
        }[sub] || sub;
        sub = capitalise(sub);

        const rawPop = splitted[splitted.length - 1];
        const isTop = rawPop[0] == "t";
        if (isTop) {
            const pop = parseInt(rawPop.substring(3));
            return `${domain} (${sub}) Top ${pop} Cities`;
        }
        const pop = parseInt(rawPop) / 1000;
        if (pop > 999) return `${domain} (${sub}) ${(pop/1000).toFixed(0)}M Cities`;
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