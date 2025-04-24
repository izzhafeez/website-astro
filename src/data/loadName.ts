import toast from "../components/common/toast";

const loadName = async (slug: string) => {
    const folder = "/data/name";

    toast.fire({
        icon: "info",
        title: "Loading data...",
        timerProgressBar: true,
        timer: 2000,
    });

    const data = await fetch(`${folder}/${slug}.json`)
        .then((res) => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error("Failed to load data");
            }
        });
    return data;
}

export default loadName;