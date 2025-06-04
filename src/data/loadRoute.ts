import toast from "../components/common/toast";
import { capitalise } from "../utils/string";

const loadStat = async (slug: string) => {
    const folder = "/data/route";
    const splitted = slug.split("-");
    const domain = splitted[0];
    const filters = splitted.length > 1 ? splitted.slice(1).map(capitalise) : [];

    toast.fire({
        icon: "info",
        title: "Loading data...",
        timerProgressBar: true,
        timer: 2000,
    });

    const data = await fetch(`${folder}/${domain}.json`)
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error("Failed to load data");
            }
        }).then(data => {
            const newData = {};
            for (const [k, v] of Object.entries(data)) {
                const hashSplit = (k as any).split("#");
                if (hashSplit.length == 1) {
                    (newData as any)[k] = v;
                    continue;
                }
                const vFilter = hashSplit[1];

                if (filters.length > 0 && !filters.includes(vFilter)) {
                    continue;
                }
                const newKey = hashSplit[0];
                
                (newData as any)[newKey] = v;
            }

            return newData;
        })

    return data;
}

export default loadStat;