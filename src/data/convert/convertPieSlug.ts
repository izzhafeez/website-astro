import { capitalise } from "../../utils/string";

const convertPieSlug = (slug: string) => {
    if (slug.toLowerCase() == "all") return "All Topics"
    return `Topics in ${capitalise(slug)}`;
}

export default convertPieSlug;