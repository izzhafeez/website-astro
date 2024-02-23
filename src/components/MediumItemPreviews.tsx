import type Item from '@items/item';
import React from 'react';
import MediumItemPreview from './MediumItemPreview';

class MediumItemPreviews extends React.Component<{ items: Item[] }> {
  render() {
    return <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-flow-row gap-2">
      {this.props.items.map(item => <MediumItemPreview item={item}/>)}
    </ul>
  }
}

export default MediumItemPreviews;