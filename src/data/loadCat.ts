import Swal from "sweetalert2";
import regionSlugs from "./cat-geo-slugs.json"; 
import { standardiseWithoutParen } from "./standardiseName";

const loadCat = async (slug: string) => {
    const folder = "/data/geo/canon";
    const splitted = slug.split('-');
    const domain = splitted[0];

    if (splitted.length == 1) {
        return await fetch(`/data/cat/${domain}.json`)
            .then(res => {
                if (res.status === 200) {
                    Swal.close()
                    return res.json();
                } else {
                    throw new Error("Failed to load data");
                }
            });
        }

    let data;
    let filter: any[] = [];
    let pop: any;
    if (slug.includes("0")) {
        pop = parseInt(splitted[splitted.length-1]);
    }

    if (splitted.length == 3) {
        filter = (regionSlugs as any)[splitted.slice(0, 2).join("-")];
    }

    data = await fetch(`${folder}/${domain}.json`)
        .then(res => {
            if (res.status === 200) {
                Swal.close()
                return res.json();
            } else {
                throw new Error("Failed to load data");
            }
        })
        .then(data => {
            const countryDict = {};
            for (const [key, value] of Object.entries(data)) {
                const countryName = key.split("#")[1];
                if (!(countryDict as any)[countryName]) (countryDict as any)[countryName] = [];
                if ((filter.length == 0 || filter.includes(countryName)) && (!pop || (value as any)[2] >= pop)) {
                    (countryDict as any)[countryName].push(standardiseWithoutParen(key));
                }
            }

            // remove all with less than 4 entries
            for (const [key, value] of Object.entries(countryDict)) {
                if ((value as any).length < 4) {
                    delete (countryDict as any)[key];
                }
            }

            return countryDict;
        })

    return data;
}

export default loadCat;