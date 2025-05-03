const getSlugs = async (type: string) => {
    let slugData = localStorage.getItem(type);
    // if (slugData) return JSON.parse(slugData);

    slugData = await fetch(`/data/slugs/${type}-slugs.json`).then(res => res.json());

    if (type == "geo") {
        let catSlugs = await fetch(`/data/slugs/cat-slugs.json`).then(res => res.json());
        catSlugs = catSlugs.filter((s: string) => s.split("-").length > 2);
        (slugData as any).push(...catSlugs);
    }

    if (type == "cat") {
        let statSlugs = await fetch(`/data/slugs/stat-slugs.json`).then(res => res.json())
        statSlugs = statSlugs.filter((s: string) => s.split("-").length == 1);
        (slugData as any).push(...statSlugs);
    }

    // localStorage.setItem(type, JSON.stringify(slugData));
    return slugData
}

export default getSlugs;