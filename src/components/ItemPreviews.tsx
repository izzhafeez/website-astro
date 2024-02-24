import type Item from '@items/item';
import React from 'react';
import ItemPreview from './ItemPreview';

class ItemPreviews extends React.Component<{ items: Item[], size: string }> {
  render() {
    const categories = new Set();
    const types = new Set();
    for (const item of this.props.items) {
      types.add(item.type);
      categories.add(item.category);
    }

    var header = 'ITEMS';
    if (types.size === 0) {
      header = 'ITEMS';
    } else if (types.size <= 2) {
      header = Array.from(types).join(" AND ").toUpperCase();
    } else if (categories.size <= 2) {
      header = Array.from(categories).join(" AND ").toUpperCase();
    }

    var className = '';
    switch (this.props.size) {
      case 'SMALL':
        className = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 grid-flow-row gap-2";
        break;
      case 'MEDIUM':
        className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-flow-row gap-2";
        break;
      case 'LARGE':
        className = "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 grid-flow-row gap-2";
        break;
    }

    return <>
      <h1 className='font-extrabold text-3xl text-black dark:text-white'>{header}</h1>
      <ul className={className}>
        {this.props.items.map(item => <ItemPreview item={item} size={this.props.size}/>)}
      </ul>
    </>
  }
}

export default ItemPreviews;