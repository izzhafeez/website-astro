import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { capitalise } from '../../../utils/string';

type Props = {
  id: number;
  data: any;
  fields: string[];
  field: string;
};

export function SortableItem(props: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: props.id});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isSkip = !props.fields.includes(props.field);
  
  return (
    <div key={props.id} ref={setNodeRef} style={style} {...attributes} {...listeners} className='py-4 pe-4 rounded-md border-[1px] border-gray-500/50 hover:border-dt-500 flex bg-white/70 transition-colors duration-500 dark:bg-gray-700/70 text-gray-900 dark:text-white'>
      <svg className="my-auto mx-2 dark:invert" width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" fill=""/>
        <circle cx="9.5" cy="6" r="0.5" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9.5" cy="10" r="0.5" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9.5" cy="14" r="0.5" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9.5" cy="18" r="0.5" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="14.5" cy="6" r="0.5" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="14.5" cy="10" r="0.5" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="14.5" cy="14" r="0.5" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="14.5" cy="18" r="0.5" stroke="#000000" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div className="w-full">
        <h3 className='text-xl font-bold text-dt-500 dark:text-dt-300 mb-2'>{props.data.name}</h3>
        <ul className="grid gap-2 xl:grid-cols-2">
        {props.fields.map((fieldName: string) => <p key={fieldName}>
          <span className={`font-bold ${fieldName === props.field ? 'animate-linear bg-[length:200%_auto] bg-gradient-to-r from-dt-500 to-dt-500 text-white p-1 rounded-md' : 'bg-gray-500/20  rounded-md p-1'}`}>{capitalise(fieldName)}</span> <span className="">{props.data[fieldName]}</span>
        </p>)}
        {isSkip && <p key={'skip'}>
          <span className={`font-bold ${isSkip ? 'animate-linear bg-[length:200%_auto] bg-gradient-to-r from-dt-500 to-dt-500 text-white p-1 rounded-md' : 'bg-gray-500/20  rounded-md p-1'}`}>Skip</span> <span className=""></span>
        </p>}
        </ul>
      </div>
    </div>
  );
}