import type Item from 'items/item';
import React, { lazy } from 'react';
import Description from './utils/Description';
const ItemPreview = lazy(() => import('./ItemPreview'));

class ItemPreviews extends React.Component<{ items: Item[], size: string, defaultHeader?: string, category?: string, toLimit?: boolean, overview?: string }> {
  render() {
    const categories = new Set();
    const types = new Set();
    const typesRaw = new Set();
    for (const item of this.props.items) {
      types.add(item.getPluralType());
      typesRaw.add(item.type);
      categories.add(item.category);
    }

    var header = 'ITEMS';
    var link = '';
    if (types.size === 0) {
      header = 'ITEMS';
    } else if (types.size <= 2) {
      header = Array.from(types).join(" AND ").toUpperCase();
    } else if (categories.size <= 2) {
      header = Array.from(categories).join(" AND ").toUpperCase();
    }
    if (types.size === 1) {
      const type = Array.from(typesRaw)[0] as string;
      const category = Array.from(categories)[0] as string;
      link = `/${category}/${type}`;
    } else if (categories.size === 1) {
      link = `/${Array.from(categories)[0] as string}`;
    }
    header = this.props.defaultHeader || header;

    var className = 'my-2 ';
    var limit = 0;
    switch (this.props.size) {
      case 'SMALL':
        className += "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 grid-flow-row gap-2";
        limit = 8;
        break;
      case 'MEDIUM':
        className += "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 grid-flow-row gap-2";
        limit = 6;
        break;
      case 'LARGE':
        className += "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 grid-flow-row gap-2";
        limit = 4;
        break;
      case 'TWIN':
        className += "grid grid-cols-1 xl:grid-cols-2 grid-flow-row gap-2";
        limit = 4;
        break;
    }
    if (!this.props.toLimit) limit = Number.MAX_SAFE_INTEGER;
    const h1Color = !!this.props.category && `text-${this.props.category}-500 dark:text-${this.props.category}-300` || 'text-black dark:text-white';
    return <>
      {!!this.props.items.length && <h1 className={`font-extrabold text-3xl ${h1Color}`}>
        {!!link ? <a href={link} className="transition duration-300 link-underline">{header}</a> : header}</h1>}
      {!!this.props.overview && <Description description={[{text: this.props.overview}]} category={this.props.category || ""}/>}
      <ul className={className}>
        {this.props.items.map(item => <li key={item.key}><ItemPreview item={item} size={this.props.size}/></li>).slice(0, limit)}
      </ul>
    </>
  }
}

export default ItemPreviews;