;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="7dcaacd3-8c4f-40bd-bbcc-e48862a6c27f",e._sentryDebugIdIdentifier="sentry-dbid-7dcaacd3-8c4f-40bd-bbcc-e48862a6c27f")}catch(e){}}();import { renderers } from './renderers.mjs';
import { manifest } from './manifest_Dn7RBpi8.mjs';
import * as serverEntrypointModule from '@astrojs/netlify/ssr-function.js';
import { onRequest } from './_astro-internal_middleware.mjs';

const _page0 = () => import('./chunks/generic_DReXcPrg.mjs');
const _page1 = () => import('./chunks/create_CHKrsYf1.mjs');
const _page2 = () => import('./chunks/index_cbJUBx1U.mjs');
const _page3 = () => import('./chunks/index_BAhSAxjw.mjs');
const _page4 = () => import('./chunks/art_QimkVh6v.mjs');
const _page5 = () => import('./chunks/courses_DJa_U27_.mjs');
const _page6 = () => import('./chunks/experience_P5-pkQxo.mjs');
const _page7 = () => import('./chunks/music_DctQAKAx.mjs');
const _page8 = () => import('./chunks/projects_BBXjxgYK.mjs');
const _page9 = () => import('./chunks/skills_B-quJB1I.mjs');
const _page10 = () => import('./chunks/index_C3Yo-XaI.mjs');
const _page11 = () => import('./chunks/_quiz__CNJkNA6w.mjs');
const _page12 = () => import('./chunks/index_C64Ce7H_.mjs');
const _page13 = () => import('./chunks/index_BTpPA5P1.mjs');
const _page14 = () => import('./chunks/_quiz__BhLA92rl.mjs');
const _page15 = () => import('./chunks/index_s5eqERnn.mjs');
const _page16 = () => import('./chunks/_quiz__BO5NDhqS.mjs');
const _page17 = () => import('./chunks/index_DoeYs_KX.mjs');
const _page18 = () => import('./chunks/_quiz__D_gXrW_3.mjs');
const _page19 = () => import('./chunks/index_C9wN82jM.mjs');
const _page20 = () => import('./chunks/index_DkwuY1Vj.mjs');
const _page21 = () => import('./chunks/robots_kenLfyIZ.mjs');
const _page22 = () => import('./chunks/index_CihN0lEf.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/apps/meetupmaker/create.astro", _page1],
    ["src/pages/apps/meetupmaker/meetup/index.astro", _page2],
    ["src/pages/apps/meetupmaker/index.astro", _page3],
    ["src/pages/portfolio/art.astro", _page4],
    ["src/pages/portfolio/courses.astro", _page5],
    ["src/pages/portfolio/experience.astro", _page6],
    ["src/pages/portfolio/music.astro", _page7],
    ["src/pages/portfolio/projects.astro", _page8],
    ["src/pages/portfolio/skills.astro", _page9],
    ["src/pages/portfolio/index.astro", _page10],
    ["src/pages/quizzes/compare/[quiz].astro", _page11],
    ["src/pages/quizzes/compare/index.astro", _page12],
    ["src/pages/quizzes/geoguessr/index.astro", _page13],
    ["src/pages/quizzes/map/[quiz].astro", _page14],
    ["src/pages/quizzes/map/index.astro", _page15],
    ["src/pages/quizzes/streak/[quiz].astro", _page16],
    ["src/pages/quizzes/streak/index.astro", _page17],
    ["src/pages/quizzes/yes-no/[quiz].astro", _page18],
    ["src/pages/quizzes/yes-no/index.astro", _page19],
    ["src/pages/quizzes/index.astro", _page20],
    ["src/pages/robots.txt.ts", _page21],
    ["src/pages/index.astro", _page22]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    renderers,
    middleware: onRequest
});
const _args = {
    "middlewareSecret": "107b05d5-2b26-484e-b0aa-136f45bd7511"
};
const _exports = serverEntrypointModule.createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
//# sourceMappingURL=entry.mjs.map
