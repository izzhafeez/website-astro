import { capitalise } from "../../utils/string";

const convertRouteSlug = (slug: string) => {
    const splitted = slug.split("-");
    if (splitted.length === 1) {
        return splitted[0].split("_").map(capitalise).join(" ");
    }
    const first = splitted[0].split("_").map(capitalise).join(" ");
    const second = splitted[1].split("_").map(capitalise).join(" ");
    return `${first} (${second})`;
}

export default convertRouteSlug;