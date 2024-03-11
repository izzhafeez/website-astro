import { capitalise } from "utils/string";
import React from "react";

class Link extends React.Component<{ category: string, className: string, text: string, href: string, key: string }> {
  render() {
    const tooltipText = this.props.category === 'no-category' ? "Visit External Site" : `Visit ${capitalise(this.props.category)} Site`;

    var bgColor;
    switch (this.props.category) {
      case "portfolio":
        bgColor = "bg-portfolio-500";
        break;
      case "blog":
        bgColor = "bg-blog-500";
        break;
      case "quiz":
        bgColor = "bg-quiz-500";
        break;
      default:
        bgColor = "bg-white text-black"
    }

    return <>
      <a href={this.props.href} key={this.props.key} data-tooltip-target={`tooltip-${this.props.href}`} type="button"
        className={this.props.className}>{this.props.text}</a>
      <span id={`tooltip-${this.props.href}`} role="tooltip" className={`absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 rounded-lg shadow-sm opacity-0 tooltip ${bgColor}`}>{tooltipText}<span className="tooltip-arrow" data-popper-arrow></span></span>
    </>
  }
}

export default Link;