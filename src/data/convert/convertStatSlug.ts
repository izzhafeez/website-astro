import { capitalise } from "../../utils/string";

const convertStatSlug = (slug: string) => {
    const splitted = slug.split("-");
    const first = splitted[0];
    const second = splitted.slice(1) || [];
    let toReturn = first.split("_").map(capitalise).filter(c => c != "C").join(" ");
    if (second) {
        toReturn += ` (${second.map(s => s.replaceAll("_", " ")).map(capitalise).join(", ")})`;
    }
    return toReturn;
}

export default convertStatSlug;