import toast from "../components/common/toast";

const loadPicture = async (slug: string) => {
    const folder = "/data/picture";
    const splitted = slug.split("-");
    const N = splitted.length;
    const domain = splitted[0];
    const filters = splitted.slice(1) || [];

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
                return !filters.length || name.split("#")[1].split(", ").some((filter: any) => filters.includes(filter));
            });

            return asObject
        })

    return data;
}

export default loadPicture;