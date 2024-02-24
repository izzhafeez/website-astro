import type Item from '@items/item';
import React from 'react';
import GoldStar from './utils/GoldStar.tsx';

class ItemPreview extends React.Component<{ item: Item, size: string }> {
  render() {
    const item = this.props.item;

    var shapeClasses = `border-[1px] flex items-center overflow-hidden`;
    if (this.props.size === 'LARGE') shapeClasses += ' h-[7rem]';
    else shapeClasses += ' h-[5rem]';
    
    var colorClasses = `border-gray-200 bg-gray-100/50 dark:border-gray-700 dark:bg-gray-800/50`;
    var spanBorder = 'ease absolute size-0 transition-all duration-200';

    switch (item.category) {
      case 'merits':
        spanBorder += ' border-merits-300';
        break;
      case 'projects':
        spanBorder += ' border-projects-300';
        break;
    }

    const linkSrc = `/${item.category}/${item.type}/${item.key}`;
    const linkClasses = `underline font-medium dark:text-white hover:text-black/75 dark:hover:text-white/75`;
    const imgSrc = !!item.imgPath ? `/img/${item.category}/${item.type}/${item.imgPath}` : '/img/desmosito-black.png';
    const imgClasses = `object-cover size-[4.5rem] p-[0.25rem] ms-1 bg-white rounded-full border-[3px] dark:border-gray-700`;

    return <article className={`${shapeClasses} ${colorClasses} relative group`} key={item.key}>
      <span class={`${spanBorder} left-0 top-0 border-t-2 group-hover:w-full`}></span>
      <span class={`${spanBorder} right-0 top-0 border-r-2 group-hover:h-full`}></span>
      <span class={`${spanBorder} bottom-0 right-0 border-b-2 group-hover:w-full`}></span>
      <span class={`${spanBorder} bottom-0 left-0 border-l-2 group-hover:h-full`}></span>
      {<img src={imgSrc} className={imgClasses}/>}
      <div className='flex-grow text-left px-2'>
        <span className='line-clamp-1 overflow-hidden'><a href={linkSrc} className={linkClasses}>{item.getTitle()}</a> {item.isStarred() && <GoldStar/>}</span>
        <div className='text-gray-500 dark:text-gray-400 leading-5'>{item.getSubtitle()}</div>
        {this.props.size === 'LARGE' && <><span className='text-gray-500 dark:text-gray-400 line-clamp-2 overflow-hidden leading-5'>{item.getOverview()}</span></>}
      </div>
    </article>;
  }
}

export default ItemPreview;