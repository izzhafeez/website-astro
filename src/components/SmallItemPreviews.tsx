import type Item from '@items/item';
import React from 'react';
import SmallItemPreview from './SmallItemPreview';

class SmallItemPreviews extends React.Component<{ items: Item[] }> {
  render() {
    return <>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 grid-flow-row gap-2">
        {this.props.items.map(item => <SmallItemPreview item={item}/>)}
      </ul>
    </>
  }
}

export default SmallItemPreviews;