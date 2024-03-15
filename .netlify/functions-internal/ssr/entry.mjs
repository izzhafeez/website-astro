;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="5109dd51-e305-4772-b9d9-4a7f7a986757",e._sentryDebugIdIdentifier="sentry-dbid-5109dd51-e305-4772-b9d9-4a7f7a986757")}catch(e){}}();import { renderers } from './renderers.mjs';
import { manifest } from './manifest_BzHGIxD1.mjs';
import * as serverEntrypointModule from '@astrojs/netlify/ssr-function.js';
import { onRequest } from './_astro-internal_middleware.mjs';

const _page0 = () => import('./chunks/generic_CwHW_vfw.mjs');
const _page1 = () => import('./chunks/_quiz__CbofXKKi.mjs');
const _page2 = () => import('./chunks/index_DQIlBBh2.mjs');
const _page3 = () => import('./chunks/_quiz__Bl07s723.mjs');
const _page4 = () => import('./chunks/index_COaEiOHV.mjs');
const _page5 = () => import('./chunks/index_BLDN5apa.mjs');
const _page6 = () => import('./chunks/art_DyMdWKKg.mjs');
const _page7 = () => import('./chunks/courses_D9xnxGXr.mjs');
const _page8 = () => import('./chunks/experience_sLH9ZjxA.mjs');
const _page9 = () => import('./chunks/music_B1bnXEMI.mjs');
const _page10 = () => import('./chunks/projects_Cf57f12H.mjs');
const _page11 = () => import('./chunks/skills_D29nSJDo.mjs');
const _page12 = () => import('./chunks/index_BSmzzwfa.mjs');
const _page13 = () => import('./chunks/robots_s_iHz0sn.mjs');
const _page14 = () => import('./chunks/index_BoBJWRno.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/gqmaster/map/[quiz].astro", _page1],
    ["src/pages/gqmaster/map/index.astro", _page2],
    ["src/pages/gqmaster/streak/[quiz].astro", _page3],
    ["src/pages/gqmaster/streak/index.astro", _page4],
    ["src/pages/gqmaster/index.astro", _page5],
    ["src/pages/portfolio/art.astro", _page6],
    ["src/pages/portfolio/courses.astro", _page7],
    ["src/pages/portfolio/experience.astro", _page8],
    ["src/pages/portfolio/music.astro", _page9],
    ["src/pages/portfolio/projects.astro", _page10],
    ["src/pages/portfolio/skills.astro", _page11],
    ["src/pages/portfolio/index.astro", _page12],
    ["src/pages/robots.txt.ts", _page13],
    ["src/pages/index.astro", _page14]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    renderers,
    middleware: onRequest
});
const _args = {
    "middlewareSecret": "85a0bca4-460c-4f32-93ad-c88fd9c4cdfd"
};
const _exports = serverEntrypointModule.createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
//# sourceMappingURL=entry.mjs.map
