import { capitalise } from "../../utils/string";

const convertCatSlug = (slug: string) => {
    if (slug.includes("0")) {
        const splitted = slug.split("-");
        let domain = capitalise(splitted[0]);
        if (domain == "Euro") domain = "Europe";
        if (domain == "Na") domain = "North America";
        if (domain == "Us") domain = "United States";
        if (domain == "Uk") domain = "United Kingdom";

        let pop = parseInt(splitted[splitted.length-1]);
        let popText;
        if (pop == 0) popText = "All Cities";
        else if (pop >= 1000000) popText = "1M Cities";
        else popText = `${(pop/1000).toFixed(0)}k Cities`;

        if (splitted.length == 2) {
            return `${domain} ${popText}`;
        }

        const sub = splitted[1].split("_").map(capitalise).join(" ");

        return `${domain} (${sub}) ${popText}`;
    }
} 

export default convertCatSlug;