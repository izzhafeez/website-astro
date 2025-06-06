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

    let invalid = !domainData || !!Object.keys(domainData)[0].match(/[A-Z]{3}/)

    if (invalid) {
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
        if (!hasDomainData && ["us", "euro", "world"].includes(domain)) {
            try {
                localStorage.setItem(domain, JSON.stringify(domainData))
            } catch (error) {}
        }

        if (N == 1) {
            return Object.entries(domainData as any);
        }

        let rawPop = "0";
        let filter: any[] = [];

        let geoSlugFirstTwo = geoSlug.split("-").slice(0, 2).join("-");
        if ((catGeoSlugs as any)[geoSlugFirstTwo] && (catGeoSlugs as any)[geoSlugFirstTwo].length) {
            rawPop = splitted[splitted.length - 1];
            filter = (catGeoSlugs as any)[geoSlugFirstTwo];
        } else if (N == 2) {
            rawPop = splitted[1];
            filter = [];
        } else if (N >= 3) {
            rawPop = splitted[splitted.length - 1];
            filter = splitted.slice(1, N - 1);
        }
        const isTop = rawPop[0] == "t";

        const dataEntries = Object.entries(domainData as any).filter(([geoName, value]: [any, any]) => (!filter.length) || filter.includes(geoName.split("#")[1]));

        if (isTop) {
            // replace all letters in rawPop with ""
            const count = parseInt(rawPop.replace(/[a-zA-Z]/g, ""));
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