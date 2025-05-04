import { capitalise } from "../../utils/string";

const convertLayoutSlug = (slug: string) => {
    const splitted = slug.split("-");
    let domain = capitalise(splitted[0]);
    if (domain == "Euro") domain = "Europe";
    if (domain == "Na") domain = "North America";
    if (domain == "Us") domain = "United States";
    if (domain == "Uk") domain = "United Kingdom";

    if (splitted.length == 1) {
        return `${domain} Subdivisions`;
    }

    const sub = splitted[1].split("_").map(capitalise).join(" ");

    return `${domain} (${sub}) Countries`;
} 

export default convertLayoutSlug;