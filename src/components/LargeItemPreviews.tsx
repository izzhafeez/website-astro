import type Item from '@items/item';
import React from 'react';
import LargeItemPreview from './LargeItemPreview';

class LargeItemPreviews extends React.Component<{ items: Item[] }> {
  render() {
    return <>
      <ul className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 grid-flow-row gap-2">
        {this.props.items.map(item => <LargeItemPreview item={item}/>)}
      </ul>
    </>
  }
}

export default LargeItemPreviews;