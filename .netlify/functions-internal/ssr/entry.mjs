;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="912588e4-9e5b-413f-8d3d-b666b966309d",e._sentryDebugIdIdentifier="sentry-dbid-912588e4-9e5b-413f-8d3d-b666b966309d")}catch(e){}}();import { renderers } from './renderers.mjs';
import { manifest } from './manifest_B6qqVyNQ.mjs';
import * as serverEntrypointModule from '@astrojs/netlify/ssr-function.js';
import { onRequest } from './_astro-internal_middleware.mjs';

const _page0 = () => import('./chunks/generic_DReXcPrg.mjs');
const _page1 = () => import('./chunks/create_Bctq12dE.mjs');
const _page2 = () => import('./chunks/index_CdEs1eg8.mjs');
const _page3 = () => import('./chunks/index_sK_Ik_fX.mjs');
const _page4 = () => import('./chunks/art_Bv4B3mqB.mjs');
const _page5 = () => import('./chunks/courses_zPhjAPd6.mjs');
const _page6 = () => import('./chunks/experience_DYNKB-nz.mjs');
const _page7 = () => import('./chunks/music_COJFtcic.mjs');
const _page8 = () => import('./chunks/projects_lLMrix2b.mjs');
const _page9 = () => import('./chunks/skills_RoaBeh11.mjs');
const _page10 = () => import('./chunks/index_C9rVzJlL.mjs');
const _page11 = () => import('./chunks/_quiz__DpoBy6H6.mjs');
const _page12 = () => import('./chunks/index_BscHP7m2.mjs');
const _page13 = () => import('./chunks/index_C28dLXq2.mjs');
const _page14 = () => import('./chunks/_quiz__6qed9BV6.mjs');
const _page15 = () => import('./chunks/index_BAJpl6bX.mjs');
const _page16 = () => import('./chunks/_quiz__CEKIoWVV.mjs');
const _page17 = () => import('./chunks/index_ujrVH5rH.mjs');
const _page18 = () => import('./chunks/_quiz__D_hFZyo5.mjs');
const _page19 = () => import('./chunks/index_B0yD84GI.mjs');
const _page20 = () => import('./chunks/index_DVLhNG4T.mjs');
const _page21 = () => import('./chunks/robots_BCsBebvq.mjs');
const _page22 = () => import('./chunks/index_BpPWgpZk.mjs');
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
    "middlewareSecret": "f768ce17-f3dc-4f3e-8bb4-62f7120e7100"
};
const _exports = serverEntrypointModule.createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
//# sourceMappingURL=entry.mjs.map
