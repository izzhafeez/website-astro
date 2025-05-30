import { capitalise } from "../../utils/string";

const convertStatSlug = (slug: string) => {
    const splitted = slug.split("-");
    const second = splitted.slice(1) || [];
    if (second.length) return second.map(s => s.replaceAll("_", " ")).map(capitalise).join(", ");
    return "All"
}

export default convertStatSlug;