import { capitalise } from "../../utils/string";
import convertGeoSlug from "./convertGeoSlug";
import convertNameSlug from "./convertNameSlug";
import convertPieSlug from "./convertPieSlug";
import convertCatSlug from "./convertCatSlug";
import convertStatSlug from "./convertStatSlug";
import convertLayoutSlug from "./convertLayoutSlug";
import convertRouteSlug from "./convertRouteSlug";
import quizData from "../quizzes/quizzes.json";

const convertSlug = (slug: string, slugType: string="") => {
    const splitted = slug.split("-");
    const N = splitted.length;

    if (slugType) {
        if (slugType === "geo") {
            // if (slug.includes("alk")) console.log(splitted, convertGeoSlug(slug));
            return convertGeoSlug(slug);
        }
        if (slugType === "name") {
            return convertNameSlug(slug);
        }
        if (slugType === "pie") {
            return convertPieSlug(slug);
        }
        if (slugType === "cat") {
            return convertCatSlug(slug);
        }
        if (slugType === "stat") {
            return convertStatSlug(slug);
        }
        if (slugType === "layout") {
            return convertLayoutSlug(slug);
        }
    }

    if ((quizData as any)[slug]) return (quizData as any)[slug].title;
    
    if (slug.includes("-g-")) {
        const splitted = slug.split("-g-");
        return `${(quizData as any)[splitted[0]].title}: ${convertGeoSlug(splitted[1])}`;
    }

    if (slug.includes("-n-")) {
        const splitted = slug.split("-n-");
        return `${(quizData as any)[splitted[0]].title}: ${convertNameSlug(splitted[1])}`;
    }

    if (slug.includes("-p-")) {
        const splitted = slug.split("-p-");
        return `${(quizData as any)[splitted[0]].title}: ${convertPieSlug(splitted[1])}`;
    }

    if (slug.includes("-c-")) {
        const splitted = slug.split("-c-");
        return `${(quizData as any)[splitted[0]].title}: ${convertCatSlug(splitted[1])}`;
    }

    if (slug.includes("-s-")) {
        const splitted = slug.split("-s-");
        return `${(quizData as any)[splitted[0]].title}: ${convertStatSlug(splitted[1])}`;
    }

    if (slug.includes("-r-")) {
        const splitted = slug.split("-r-");
        return `${(quizData as any)[splitted[0]].title}: ${convertRouteSlug(splitted[1])}`;
    }

    if (slug.includes("-l-")) {
        const splitted = slug.split("-l-");
        return `${(quizData as any)[splitted[0]].title}: ${convertLayoutSlug(splitted[1])}`;
    }

    return capitalise(slug)
}

export default convertSlug;