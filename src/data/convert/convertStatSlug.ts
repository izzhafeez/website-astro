import { capitalise } from "../../utils/string";

const convertStatSlug = (slug: string) => {
    const splitted = slug.split("-");
    return splitted.map(s => s.split("_").map(capitalise).join(" ")).join(" ");
}

export default convertStatSlug;