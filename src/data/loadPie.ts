import toast from "../components/common/toast";
import { capitalise } from "../utils/string";

const loadPie = async (slug: string) => {
    const folder = "/data/misc";

    toast.fire({
        icon: "info",
        title: "Loading data...",
        timerProgressBar: true,
        timer: 2000,
    });

    const data = await fetch(`${folder}/pie.json`)
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error("Failed to load data");
            }
        })
        .then(json => {
            if (slug.toLowerCase() === "all") return json;
            const filtered = {}
            Object.entries(json).forEach(([k, v]) => {
                if ((v as any).tags.includes(capitalise(slug))) {
                    (filtered as any)[k] = v;
                }
            });
            if (Object.keys(filtered).length === 0) {
                throw new Error("No data found for the given slug");
            }
            return filtered;
        })

    return data;
};

export default loadPie;