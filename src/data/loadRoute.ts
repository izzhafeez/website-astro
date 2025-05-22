import toast from "../components/common/toast";
import { capitalise } from "../utils/string";

const loadStat = async (slug: string) => {
    const folder = "/data/route";
    const domain = slug;

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
        })

    return data;
}

export default loadStat;