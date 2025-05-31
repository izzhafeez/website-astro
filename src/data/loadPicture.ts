import toast from "../components/common/toast";

const loadPicture = async (slug: string) => {
    const folder = "/data/picture";
    const splitted = slug.split("-");
    const N = splitted.length;
    const domain = splitted[0];
    const all_filters = splitted.slice(1) || [];
    const yes_filters = all_filters.filter((filter: any) => !filter.startsWith("no_"));
    const no_filters = all_filters.filter((filter: any) => filter.startsWith("no_")).map((filter: any) => filter.replace("no_", ""));

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
        .then(json => {
            const asObject = Object.entries(json).filter(([name, value]: [any, any]) => {
                const nameFilters = name.split("#")[1].split(", ").map((filter: any) => filter.trim());
                return (!yes_filters.length || nameFilters.some((filter: any) => yes_filters.includes(filter)))
                    && !no_filters.some((filter: any) => nameFilters.includes(filter));
            });

            return asObject
        })

    return data;
}

export default loadPicture;