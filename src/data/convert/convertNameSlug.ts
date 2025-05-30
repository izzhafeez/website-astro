import { capitalise } from "../../utils/string";

const convertNameSlug = (slug: string) => {
    const splitted = slug.split("-");
    return splitted.map(s => s.split("_").map(capitalise).filter(c => c != "C").join(" ")).join(" ");
}

export default convertNameSlug;