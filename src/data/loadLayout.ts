import Swal from "sweetalert2";
import regionSlugs from "./cat-geo-slugs.json"; 
import { standardiseWithoutParen } from "./standardiseName";

const loadLayout = async (slug: string) => {
    const folder = "/data/geo/canon";
    const splitted = slug.split('-');
    const domain = splitted[0];

    let filter = [];
    if (splitted.length == 2) {
        filter = (regionSlugs as any)[slug];
    }

    let data = await fetch(`${folder}/${domain}.json`)
        .then((res) => {
            if (res.status === 200) {
                Swal.close()
                return res.json();
            } else {
                throw new Error("Failed to load data");
            }
        }).then((data) => {
            const countryDict = {};
            for (const [key, value] of Object.entries(data)) {
                const countryName = key.split("#")[1];
                if (!(countryDict as any)[countryName]) (countryDict as any)[countryName] = [];
                if ((filter.length == 0 || filter.includes(countryName)) && (countryDict as any)[countryName].length < 10) {
                    (countryDict as any)[countryName].push([standardiseWithoutParen(key), ...(value as any)]);
                }
            }
            // remove all with less than 10 entries
            for (const [key, value] of Object.entries(countryDict)) {
                if ((value as any).length < 10) {
                    delete (countryDict as any)[key];
                }
            }
            return countryDict;
        });

    return data;
}

export default loadLayout;