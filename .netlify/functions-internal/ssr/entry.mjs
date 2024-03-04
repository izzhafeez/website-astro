;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="a23f9d0f-4a1f-4689-8c26-e49f05793bc6",e._sentryDebugIdIdentifier="sentry-dbid-a23f9d0f-4a1f-4689-8c26-e49f05793bc6")}catch(e){}}();import { renderers } from './renderers.mjs';
import { manifest } from './manifest__NIkb9vY.mjs';
import * as serverEntrypointModule from '@astrojs/netlify/ssr-function.js';
import { onRequest } from './_astro-internal_middleware.mjs';

const _page0 = () => import('./chunks/generic_FrhvdOJ6.mjs');
const _page1 = () => import('./chunks/index_nOTskGr_.mjs');
const _page2 = () => import('./chunks/index_nW-a9BWT.mjs');
const _page3 = () => import('./chunks/robots_q9vhcu0h.mjs');
const _page4 = () => import('./chunks/index_xcBdqH65.mjs');
const _page5 = () => import('./chunks/index_w9J7VYrP.mjs');
const _page6 = () => import('./chunks/index_odo48jdz.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/quiz/map/[key]/index.astro", _page1],
    ["src/pages/index.astro", _page2],
    ["src/pages/robots.txt.ts", _page3],
    ["src/pages/[category]/index.astro", _page4],
    ["src/pages/[category]/[type]/index.astro", _page5],
    ["src/pages/[category]/[type]/[key]/index.astro", _page6]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    renderers,
    middleware: onRequest
});
const _args = {
    "middlewareSecret": "2c9e1668-35f2-4d2b-8220-74d25cc82a6c"
};
const _exports = serverEntrypointModule.createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (_start in serverEntrypointModule) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
//# sourceMappingURL=entry.mjs.map
