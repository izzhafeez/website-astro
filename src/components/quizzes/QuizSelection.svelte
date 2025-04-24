<script lang="ts">
    import { onMount } from "svelte";
    import getSlugs from "../../data/getSlugs";
    import quizData from "../../data/quizzes/quizzes.json";
    import homeData from "../../data/home.json";
    import convertSlug from "../../data/convert/convertSlug";
    import catGeoSlugs from "../../data/cat-geo-slugs.json";

    // svg imports
    import logos from "../common/logos";

    export let search = "";
    export let page = 1;
    export let exclude = false;

    const PER_PAGE = 50;

    let searchArray = search.toLowerCase().split(" ");
    let slugs = {};
    let quizRegistrations = {};

    const registerIncidence = (searchArray: string[], slugs: any) => async (slugType: string) => {
        let typedSlug = await getSlugs(slugType);
        let typeRegistrations = {};
        for (let rawSlug of typedSlug) {
            let slug = convertSlug(rawSlug, slugType).toLowerCase();
            let incidence = searchArray.map(word => slug.includes(word) ? 1 : 0);
            let incidenceKey = incidence.join(",");
            if (!typeRegistrations[incidenceKey]) typeRegistrations[incidenceKey] = [];
            typeRegistrations[incidenceKey].push(rawSlug);
        }
        slugs[slugType] = typeRegistrations;
    }

    let combinations = [];
    let finalSlugs = [];
    let standalones = [];

    onMount(async () => {
        const register = registerIncidence(searchArray, slugs);
        if (!exclude) {
            await register("geo");
        }
        await register("stat");
        await register("name");
        await register("pie");
        await register("cat");

        for (let [k, v] of Object.entries(quizData)) {
            const title = v.title.toLowerCase();
            let incidence = searchArray.map(word => title.includes(word) ? 1 : 0);
            const acceptedSlugs = v.slugs;

            if (acceptedSlugs.length == 0) {
                let successCount = incidence.filter(i => i > 0).length;
                if (successCount * 2 > searchArray.length) {
                    standalones.push(k);
                }
            }


            for (let slugType of acceptedSlugs) {
                if (!slugs[slugType]) continue;
                let slugIncidences = slugs[slugType];
                for (let rawSlugIncidence of Object.keys(slugIncidences)) {
                    let slugIncidence = rawSlugIncidence.split(",").map(Number);
                    if (incidence.length !== slugIncidence.length) continue;
                    let combinedIncidence = incidence.map((i, index) => i + slugIncidence[index]);
                    let successCount = combinedIncidence.filter(i => i > 0).length;
                    if (successCount * 2 > searchArray.length) combinations.push([k, slugType, rawSlugIncidence, combinedIncidence.reduce((a,b) => a + b)]);
                }
            }
        }
        
        let i = 0;
        let startingI = PER_PAGE * (page - 1);
        let endingI = startingI + PER_PAGE - 1;

        finalSlugs = [];

        for (let standalone of standalones) {
            if (i >= startingI && i <= endingI) {
                finalSlugs.push(standalone)
            }
            i++;
        }

        let typedSlugs = [];
        for (let combination of combinations) {
            for (let typeSlug of slugs[combination[1]][combination[2]]) {
                if (!exclude || !typeSlug.includes('0')) typedSlugs.push(`${combination[0]}-${combination[1][0]}-${typeSlug}`);
            }
        }

        for (let slug of typedSlugs.sort((a,b) => a.length-b.length)) {
            if (i >= startingI && i <= endingI) {
                finalSlugs.push(slug);
            }
            i++;
        }
    });

    const handleSubmit = (e: Event) => {
        e.preventDefault(); // Prevent page reload
        const trimmed = search.trim();
        window.location.href = `/quizzes?search=${encodeURIComponent(trimmed)}&page=1&exclude=${exclude ? "t" : ""}`;
    };
</script>

<div class="p-2 max-w-3xl mx-auto grid">
    <form on:submit={handleSubmit} class="mb-8 grid gap-2 w-72">
        <div class="flex">
            <label for="geo" class="my-auto">Search:</label>
            <input
                type="text"
                bind:value={search}
                placeholder="Search for quizzes..."
                class="ms-auto p-2 rounded-lg border-2 border-ns-500/50 dark:bg-gray-800 focus:outline-none focus:border-ns-500/50"
            />
        </div>
        <div class="my-auto flex">
            <label for="geo" class="my-auto">Exclude Geo:</label>
            <input
                type="checkbox"
                id="geo"
                bind:checked={exclude}
                class="dark:bg-gray-700 rounded-md px-2 py-2 my-auto mx-2"
            />
            <button type="submit" class="bg-ns-500/50 text-white p-2 rounded-lg hover:bg-ns-500/70 ms-auto">
                Search
            </button>
        </div>
    </form>

    <div class ="grid gap-3">
        <h2 class="text-3xl text-ns-500 font-extrabold">SEARCH RESULTS</h2>
        {#each finalSlugs as slug}
            <a href={`/quizzes/${slug}`} class="text-lg hover:underline rounded-lg">
                <div class="flex gap-4">
                    <img src={logos[slug.split("-")[0]].src} class="w-10 h-10 my-auto" alt="svg"/><span class="bg-ns-500/50 p-2 rounded-lg">{convertSlug(slug).split(":")[0]}</span> <span class="my-auto">{convertSlug(slug).split(":")[1]}</span>
                </div>
            </a>
        {/each}
        {#if finalSlugs.length == 0}
            <p class="text-lg">Haiya no results la. Go search for something else.</p>
        {/if}
    </div>

    <!-- page select -->
    <div class="flex justify-center mt-4 gap-8 mx-auto">
        {#if page > 1}
            <a href={`/quizzes?search=${encodeURIComponent(search)}&page=${page - 1}&exclude=${exclude ? "t" : ""}`} class="bg-ns-500/50 text-white p-2 rounded-lg hover:bg-ns-500/70 me-2">
                &lt;
            </a>
        {/if}
        <div class="my-auto">Page {page}</div>
        {#if finalSlugs.length >= PER_PAGE || page < 1}
            <a href={`/quizzes?search=${encodeURIComponent(search)}&page=${page + 1}&exclude=${exclude ? "t" : ""}`} class="bg-ns-500/50 text-white p-2 rounded-lg hover:bg-ns-500/70">
                &gt;
            </a>
        {/if}
    </div>

    <span class="opacity-0">wow you found some hidden text wow you found some hidden text wow you found some hidden text wow you found some hidden text wow you found some hidden text</span>

</div>