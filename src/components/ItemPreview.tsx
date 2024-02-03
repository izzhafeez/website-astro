import type { Item } from '@items/item';
import React from 'react';

class ItemPreview extends React.Component<{ item: Item }> {
  render() {
    return <div><a href={this.props.item.getBackLink()}>{this.props.item.category}</a></div>
  }
}

export default ItemPreview;