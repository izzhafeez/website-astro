import { renderers } from './renderers.mjs';
import { manifest } from './manifest_aUQMQEib.mjs';
import * as serverEntrypointModule from '@astrojs/netlify/ssr-function.js';
import { onRequest } from './_noop-middleware.mjs';

const _page0 = () => import('./chunks/generic_B9CqaCVV.mjs');
const _page1 = () => import('./chunks/_quiz__RLg6MDOc.mjs');
const _page2 = () => import('./chunks/index_CgMI7urP.mjs');
const _page3 = () => import('./chunks/_quiz__B4226e6r.mjs');
const _page4 = () => import('./chunks/index_9wgO7sLH.mjs');
const _page5 = () => import('./chunks/index_Dd4DU1yR.mjs');
const _page6 = () => import('./chunks/art_CDK39n5R.mjs');
const _page7 = () => import('./chunks/courses_DoD2FqZr.mjs');
const _page8 = () => import('./chunks/experience_DaBcZl1c.mjs');
const _page9 = () => import('./chunks/music_C0MRhJEh.mjs');
const _page10 = () => import('./chunks/projects_Cja0nxQ2.mjs');
const _page11 = () => import('./chunks/skills_BTPa83cn.mjs');
const _page12 = () => import('./chunks/index_DFRVDA2_.mjs');
const _page13 = () => import('./chunks/robots_Du3Yk8Tr.mjs');
const _page14 = () => import('./chunks/index_Cj7mnGyp.mjs');
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
    "middlewareSecret": "dea3a853-c2fc-4414-a3c6-21ed59c32fbb"
};
const _exports = serverEntrypointModule.createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
