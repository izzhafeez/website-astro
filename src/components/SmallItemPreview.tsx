import type Item from '@items/item';
import React from 'react';
import { addEllipsis } from '../utils/string.ts';
import Link from './nav/Link.tsx';

const MAX_LENGTH = 25;

class SmallItemPreview extends React.Component<{ item: Item }> {
  render() {
    const title = addEllipsis(this.props.item.getTitle(), MAX_LENGTH);
    const subtitle = addEllipsis(this.props.item.getSubtitle(), MAX_LENGTH);
    const item = this.props.item;

    return <article className={`border-[1px] border-lrt-500 leading-5 flex items-center overflow-hidden
      bg-black/70 rounded-l-full hover:bg-gradient-to-r hover:from-${item.category}-500 hover:to-${item.category}-900`} key={item.key}>
      <img src={`/img/${item.category}/${item.type}/${item.imgPath}`} className='object-cover size-[4rem] p-[0.5rem] bg-white rounded-full'/>
      <div className='flex-grow text-left px-2'>
        <Link link={'/'} text={title} category={item.category}/>
        <br/>
        {subtitle}
      </div>
    </article>;
  }
}

export default SmallItemPreview;