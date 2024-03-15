export { renderers } from '../renderers.mjs';

const page = () => import('./pages/generic_BSMNQSTv.mjs').then(n => n.g);

export { page };
