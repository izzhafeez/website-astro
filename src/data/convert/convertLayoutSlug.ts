import { capitalise } from "../../utils/string";

const convertLayoutSlug = (slug: string) => {
    const splitted = slug.split("-");
    let domain = capitalise(splitted[0]);
    if (domain == "Euro") domain = "Europe";
    if (domain == "Na") domain = "North America";
    if (domain == "Us") domain = "United States";
    if (domain == "Uk") domain = "United Kingdom";

    if (splitted.length == 1 && !["North America", "Europe"].includes(domain)) {
        return `${domain} Subdivisions`;
    }

    let sub = "";
    if (splitted.length > 1) {
        sub = splitted[1].split("_").map(capitalise).join(" ");
    }

    return !!sub ? `${domain} (${sub}) Countries` : `${domain} Countries`;
} 

export default convertLayoutSlug;