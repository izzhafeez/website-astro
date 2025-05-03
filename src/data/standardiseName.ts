export const standardiseWithoutParen = (geoName: string) => {
    return geoName.split(" [")[0].split(" (")[0].split(",")[0].split("#")[0].trim();
}

export const standardiseWithParen = (geoName: string) => {
    return geoName.split(" [")[0].split(",")[0].split("#")[0].trim();
}