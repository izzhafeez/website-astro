import { renderers } from './renderers.mjs';
import { manifest } from './manifest_WcNqFdUj.mjs';
import * as serverEntrypointModule from '@astrojs/netlify/ssr-function.js';
import { onRequest } from './_noop-middleware.mjs';

const _page0 = () => import('./chunks/generic_CttHKl3B.mjs');
const _page1 = () => import('./chunks/_quiz__BaUvE24B.mjs');
const _page2 = () => import('./chunks/index__SHJJoX_.mjs');
const _page3 = () => import('./chunks/_quiz__BP0DjPee.mjs');
const _page4 = () => import('./chunks/index_Bv08Y-65.mjs');
const _page5 = () => import('./chunks/index_O9VpTMd1.mjs');
const _page6 = () => import('./chunks/art_BYnv3z37.mjs');
const _page7 = () => import('./chunks/courses_Dbqulzuv.mjs');
const _page8 = () => import('./chunks/experience_Bv4VAjBH.mjs');
const _page9 = () => import('./chunks/music_Den5eN8L.mjs');
const _page10 = () => import('./chunks/projects_DDK-ILqu.mjs');
const _page11 = () => import('./chunks/skills_eK8Ko7Xr.mjs');
const _page12 = () => import('./chunks/index_C9qtLc2l.mjs');
const _page13 = () => import('./chunks/robots_mlfnLSnS.mjs');
const _page14 = () => import('./chunks/index_99XfJhcR.mjs');
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
    "middlewareSecret": "3ac16542-d913-4f20-aeaf-7b30ad5f14a5"
};
const _exports = serverEntrypointModule.createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
