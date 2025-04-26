import swal from "sweetalert2";
import toast from "../components/common/toast";
import catGeoSlugs from "./cat-geo-slugs.json";

const loadGeo = async (geoSlug: string) => {
    const folder = "/data/geo/canon";

    toast.fire({
        icon: "info",
        title: "Loading data...",
        timerProgressBar: true,
        timer: 2000,
    });

    const splitted = geoSlug.split("-");
    const N = splitted.length;
    const domain = splitted[0];

    // retrieve from cache using domain
    let domainData = localStorage.getItem(domain);
    let hasDomainData = !!domainData;
    if (domainData) domainData = JSON.parse(domainData);

    if (!domainData) {
        domainData = await fetch(`${folder}/${domain}.json`)
            .then((res) => {
                if (res.status === 200) {
                    swal.close();
                    return res.json();
                } else {
                    throw new Error("Failed to load data");
                }
            });
        }

    const data = (() => {
        // save to local if not there
        if (!hasDomainData) localStorage.setItem(domain, JSON.stringify(domainData))

        if (N == 1) {
            return Object.entries(domainData as any);
        }

        let rawPop = "0";
        let filter: any[] = [];

        let geoSlugFirstTwo = geoSlug.split("-").slice(0, 2).join("-");
        if ((catGeoSlugs as any)[geoSlugFirstTwo] && (catGeoSlugs as any)[geoSlugFirstTwo].length) {
            filter = (catGeoSlugs as any)[geoSlugFirstTwo];
        } else if (N == 2) {
            rawPop = splitted[1];
            filter = [];
        } else if (N == 3) {
            rawPop = splitted[2];
            filter = [splitted[1]];
        }
        const isTop = rawPop[0] == "t";

        const dataEntries = Object.entries(domainData as any).filter(([geoName, value]: [any, any]) => (!filter.length) || filter.includes(geoName.split("#")[1]));

        if (isTop) {
            const count = parseInt(rawPop.substring(3));
            const limited = dataEntries.slice(0, count);
            return limited;
        }

        const pop = parseInt(rawPop);

        const limited = dataEntries.filter(([key, value]: [any, any]) => value[2] > pop);
        return limited;
    })();

    return data;
}

export default loadGeo;