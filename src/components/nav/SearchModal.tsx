import React from 'react';
import { allItems } from '../../items/getItems';
import ItemPreviews from '../ItemPreviews.tsx';
import type Item from '@items/item.ts';

interface State {
  items: Item[]
}

class SearchModal extends React.Component<any, State> {
  constructor(props: any) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      items: allItems.slice(0, 10)
    };
  }

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newItems: Item[] = [];
    for (const item of allItems) {
      if (item.title.toLowerCase().replace(' ', '').includes(e.target.value.toLowerCase().replace(' ', ''))) {
        newItems.push(item);
      }
      if (newItems.length === 10) break;
    }
    this.setState(_ => ({
      items: newItems
    }));
  }

  render() {
    return (
      <div id="search-modal" tabIndex={-1} aria-hidden='true' className="hidden overflow-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-screen md:inset-0 h-screen bg-white/70 dark:bg-gray-900/70 p-4">
        <div className="relative w-[50rem] max-h-screen">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 p-4 border-gray-300 dark:border-gray-700 border-[1px]">
            <div className="max-w-md mx-auto md:p-5"> {/* Adjust the height as needed */}
              <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="size-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
                <input type="search" onChange={this.handleChange} id="default-search" className="block w-full py-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-hp-500 focus:border-hp-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-hp-500 dark:focus:border-hp-500" placeholder="Search..." required />
              </div>
            </div>
            <div className='max-h-[30rem] overflow-y-auto'>
              <ItemPreviews items={this.state.items} defaultHeader={`SEARCH RESULTS (${this.state.items.length})`} size='TWIN'/>
            </div>
          </div>
        </div>
      </div>
    );
    
  }
}

export default SearchModal;