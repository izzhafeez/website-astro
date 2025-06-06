import unidecode from "unidecode";

export const standardiseWithoutParen = (geoName: string) => {
    return geoName.split(" [")[0].split(" (")[0].split(",")[0].split("#")[0].replaceAll(".", "").replaceAll("'", "").trim();
}

export const standardiseWithParen = (geoName: string) => {
    return geoName.split(" [")[0].split(",")[0].split("#")[0].replaceAll(".", "").replaceAll("'", "").trim();
}

export const standardiseCanonical = (name: string) => {
    return unidecode(name).replaceAll(/[^a-zA-Z0-9]/gi, "").toLowerCase().trim();
}