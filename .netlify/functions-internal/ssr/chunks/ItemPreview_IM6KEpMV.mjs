;!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="61d1dc62-d2cd-4992-89b2-8f4288e7cace",e._sentryDebugIdIdentifier="sentry-dbid-61d1dc62-d2cd-4992-89b2-8f4288e7cace")}catch(e){}}();import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import React from 'react';
import './prerender_j5B9pZYU.mjs';

class GoldStar extends React.Component {
  render() {
    return /* @__PURE__ */ jsx("span", { className: "text-cc-500", children: "★" });
  }
}

class ItemPreview extends React.Component {
  render() {
    const item = this.props.item;
    var shapeClasses = `border-[1px] flex items-center overflow-hidden`;
    if (this.props.size === "LARGE")
      shapeClasses += " h-[7rem]";
    else
      shapeClasses += " h-[5rem]";
    var colorClasses = `border-gray-200 bg-gray-100/50 dark:border-gray-700 dark:bg-gray-800/50`;
    var spanBorder = "ease absolute size-0 transition-all duration-200";
    switch (item.category) {
      case "portfolio":
        spanBorder += " border-portfolio-500 dark:border-portfolio-300";
        break;
      case "blog":
        spanBorder += " border-blog-500 dark:border-blog-300";
        break;
    }
    const linkSrc = `/${item.category}/${item.type}/${item.key}`;
    const linkClasses = `underline font-medium dark:text-white hover:text-black/75 dark:hover:text-white/75`;
    const imgSrc = !!item.imgPath ? `/img/${item.category}/${item.type === "mall" ? "compressed-mall" : item.type}/${item.imgPath}` : "/img/desmosito-black.png";
    const imgClasses = `object-cover size-[4.5rem] p-[0.25rem] ms-1 bg-white rounded-full border-[3px] dark:border-gray-700`;
    return /* @__PURE__ */ jsxs("article", { className: `${shapeClasses} ${colorClasses} relative group`, children: [
      /* @__PURE__ */ jsx("span", { className: `${spanBorder} left-0 top-0 border-t-2 group-hover:w-full` }),
      /* @__PURE__ */ jsx("span", { className: `${spanBorder} right-0 top-0 border-r-2 group-hover:h-full` }),
      /* @__PURE__ */ jsx("span", { className: `${spanBorder} bottom-0 right-0 border-b-2 group-hover:w-full` }),
      /* @__PURE__ */ jsx("span", { className: `${spanBorder} bottom-0 left-0 border-l-2 group-hover:h-full` }),
      /* @__PURE__ */ jsxs("span", { className: "relative flex h-3 w-3", children: [
        /* @__PURE__ */ jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" }),
        /* @__PURE__ */ jsx("span", { className: "relative inline-flex rounded-full h-3 w-3 bg-sky-500" })
      ] }),
      /* @__PURE__ */ jsx("img", { src: imgSrc, className: imgClasses, loading: "lazy" }),
      /* @__PURE__ */ jsxs("div", { className: "flex-grow text-left px-2", children: [
        /* @__PURE__ */ jsxs("span", { className: "line-clamp-1 overflow-hidden", children: [
          /* @__PURE__ */ jsx("a", { href: linkSrc, className: linkClasses, children: item.getTitle() }),
          " ",
          item.isStarred() && /* @__PURE__ */ jsx(GoldStar, {})
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-gray-500 dark:text-gray-400 leading-5", children: item.getSubtitle() }),
        this.props.size === "LARGE" && /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx("span", { className: "text-gray-500 dark:text-gray-400 line-clamp-2 overflow-hidden leading-5", children: item.getOverview() }) })
      ] })
    ] });
  }
}

export { ItemPreview as default };
//# sourceMappingURL=ItemPreview_IM6KEpMV.mjs.map
