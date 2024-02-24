import React from "react";

class Link extends React.Component<{ link: string, text: string, category?: string }> {
  render() {
    const { link, text, category } = this.props;

    return <a href={link}
      className={`underline font-medium`}>{text}</a>;
  }
}

export default Link;