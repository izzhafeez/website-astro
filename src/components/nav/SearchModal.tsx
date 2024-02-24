import React from 'react';
import { allItems } from '../../items/getItems';
import ItemPreviews from '../ItemPreviews.tsx';

class SearchModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      items: []
    };
  }

  handleChange(e) {
    const newItems = [];
    for (const item of allItems) {
      if (item.title.toLowerCase().replace(' ', '').includes(e.target.value.toLowerCase().replace(' ', ''))) {
        newItems.push(item);
      }
      if (newItems.length === 10) break;
    }
    this.setState(prev => ({
      items: newItems
    }));
  }

  render() {
    return (
      <div id="search-modal" tabIndex="-1" aria-hidden='true' className="hidden overflow-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-screen md:inset-0 h-screen bg-white/70 dark:bg-gray-900/70">
        <div className="relative w-[50rem] max-h-screen">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 p-4 border-black border-[1px]">
            <button type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="search-modal">
              <svg className="size-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <div className="max-w-md mx-auto md:p-5"> {/* Adjust the height as needed */}
              <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="size-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
                <input type="search" onChange={this.handleChange} id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search..." required />
                <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
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