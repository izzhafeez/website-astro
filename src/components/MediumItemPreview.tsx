import type Item from '@items/item';
import React from 'react';
import { addEllipsis } from '../utils/string.ts';

const MAX_LENGTH = 40;

class MediumItemPreview extends React.Component<{ item: Item }> {
  render() {
    const title = addEllipsis(this.props.item.getTitle(), MAX_LENGTH);
    const subtitle = addEllipsis(this.props.item.getSubtitle(), MAX_LENGTH);

    return <article className={`border-[1px] border-black-500 leading-5 flex items-center overflow-hidden`}>
      <img src='/img/merits/awards/nus.png' className='object-cover w-[4rem] h-[4rem]'/>
      <div className='flex-grow text-left px-2'>
        {title}
        <br/>
        {subtitle}
      </div>
    </article>;
  }
}

export default MediumItemPreview;