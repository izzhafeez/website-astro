import React from "react";

class Link extends React.Component<{ link: string, text: string, category?: string }> {
  render() {
    const { link, text, category } = this.props;

    return <a href={link}
      className={`underline text-${category}-500`}>{text}</a>;
  }
}

export default Link;