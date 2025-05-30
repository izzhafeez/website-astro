<script lang="ts">
    import { onMount } from "svelte";
    import loadData from "../../data/loadData";
    import PositionPuzzle from "./position/PositionPuzzle.svelte";
    import BlurryQuiz from "./blurry/BlurryQuiz.svelte";
    import MapQuiz from "./map/MapQuiz.svelte";
    import RegexWarrior from "./regex/RegexWarrior.svelte";
    import JumbleQuiz from "./jumble/JumbleQuiz.svelte";
    import RankQuiz from "./rank/RankQuiz.svelte";
    import CompareQuiz from "./compare/CompareQuiz.svelte";
    import ColorGuessr from "./color/ColorQuiz.svelte";
    import PiePuzzle from "./pie/PiePuzzle.svelte";
    import ConnectQuiz from "./connect/ConnectQuiz.svelte";
    import ProximatePuzzle from "./proximate/ProximatePuzzle.svelte";
    import SatelliteQuiz from "./satellite/SatelliteQuiz.svelte";
    import ScrambleQuiz from "./scramble/ScrambleQuiz.svelte";
    import DigraphQuiz from "./digraph/DigraphQuiz.svelte";
    import TypeQuiz from "./type/TypeQuiz.svelte";
    import TriangleQuiz from "./triangle/TriangleQuiz.svelte";
    import LayoutQuiz from "./layout/LayoutQuiz.svelte";
    import CipherQuiz from "./cipher/CipherQuiz.svelte";
    import CoverageQuiz from "./coverage/CoverageQuiz.svelte";
    import ExpandingQuiz from "./expanding/ExpandingQuiz.svelte";
    import RouteQuiz from "./route/RouteQuiz.svelte";
    import GridQuiz from "./grid/GridQuiz.svelte";
    import PictureQuiz from "./picture/PictureQuiz.svelte";
    import convertSlug from "../../data/convert/convertSlug";
    import quizData from "../../data/quizzes/quizzes.json";

    export let quiz: string;
    export let params: any

    let title = convertSlug(quiz);
    let data: any;
    const splitted = quiz.split("-");
    const quizType = splitted[0];
    let instructions = quizData[quizType].heroText;

    onMount(async () => {
        data = await loadData(quiz);
    });
</script>

{#if data}
    {#if quizType == "position"}
        <PositionPuzzle {data} {title} {instructions} {params}/>
    {:else if quizType == "blurry"}
        <BlurryQuiz names={data} {title} {instructions} {params}/>
    {:else if quizType == "map"}
        <MapQuiz {data} {title} {instructions} {params}/>
    {:else if quizType == "regex"}
        <RegexWarrior names={data} {title} {instructions} {params}/>
    {:else if quizType == "jumble"}
        <JumbleQuiz names={data} {title} {instructions} {params}/>
    {:else if quizType == "rank"}
        <RankQuiz {data} {title} {instructions} {params}/>
    {:else if quizType == "compare"}
        <CompareQuiz {data} {title} {instructions} {params}/>
    {:else if quizType == "color"}
        <ColorGuessr {title} {instructions} {params}/>
    {:else if quizType == "pie"}
        <PiePuzzle data={Object.entries(data)} {title} {instructions} {params}/>
    {:else if quizType == "connect"}
        <ConnectQuiz {title} {data} {instructions} {params}/>
    {:else if quizType == "proximate"}
        <ProximatePuzzle {title} {data} {instructions} {params}/>
    {:else if quizType == "satellite"}
        <SatelliteQuiz {data} {title} {instructions} {params}/>
    {:else if quizType == "digraph"}
        <DigraphQuiz {data} {title} {instructions} {params}/>
    {:else if quizType == "type"}
        <TypeQuiz names={data} {title} {instructions} {params}/>
    {:else if quizType == "triangulate"}
        <TriangleQuiz {data} {title} {instructions} {params}/>
    {:else if quizType == "layout"}
        <LayoutQuiz {data} {title} {instructions} {params}/>
    {:else if quizType == "scramble"}
        <ScrambleQuiz names={data} {title} {instructions} {params}/>
    {:else if quizType == "cipher"}
        <CipherQuiz names={data} {title} {instructions} {params}/>
    {:else if quizType == "coverage"}
        <CoverageQuiz {data} {title} {instructions} {params}/>
    {:else if quizType == "expanding"}
        <ExpandingQuiz {data} {title} {instructions} {params}/>
    {:else if quizType == "route"}
        <RouteQuiz {data} {title} {instructions} {params}/>
    {:else if quizType == "grid"}
        <GridQuiz {data} {title} {instructions} {params}/>
    {:else if quizType == "picture"}
        <PictureQuiz {data} {title} {instructions} {params}/>
    {:else}
        <p>Quiz type not found</p>
    {/if}
{:else}
    <p>Loading...</p>
{/if}