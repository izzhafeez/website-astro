import React from 'react';
import { capitalise } from '../../../utils/string';
import { motion } from "framer-motion";

type Props = {
  id: number;
  data: any;
  fields: string[];
  field: string;
  fieldThresholds: any;
  index: number;
  handleMove: (index: number, isUp: boolean) => void;
};

const spring = {
  type: "spring",
  damping: 20,
  stiffness: 300
};

export function SortableItem(props: Props) {

  const isSkip = !props.fields.includes(props.field);
  const upArrow = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>;
  const downArrow = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>;
  
  return (
    <motion.li
      key={props.id}
      className='py-4 pe-4 rounded-md border-[1px] border-gray-500/50 hover:border-dt-500 flex bg-gray-100/70 transition-colors duration-500 dark:bg-gray-700/70 text-gray-900 dark:text-white'
      layout
      transition={spring}>
      <div className='px-2 my-auto'>
        {props.index !== 0 && <span
          className="cursor-pointer"
          onClick={() => props.handleMove(props.index, true)}>
          {upArrow}
        </span>}
        {props.index !== props.fields.length && <span
          className="cursor-pointer"
          onClick={() => props.handleMove(props.index, false)}>
          {downArrow}
          </span>}
      </div>
      <div className="w-full">
        <div className='flex w-full'>
          <h3 className='text-xl font-bold text-dt-700 dark:text-dt-300 mb-2'>{props.data.name}</h3>
          <h3 className='ms-auto mb-2' data-tooltip-target={`tooltip-${props.id}`}>Rank {props.id}</h3>
        </div>
        <ul className="grid gap-2 grid-cols-2 lg:grid-cols-4">
        {props.fields.map((fieldName: string, index: number) => <p key={fieldName}>
          <span className={`font-bold ${fieldName === props.field ? 'animate-linear bg-[length:200%_auto] bg-gradient-to-r from-dt-500 to-dt-500 text-white p-1 rounded-md' : 'bg-gray-500/20  rounded-md p-1'}`}>{capitalise(fieldName)}</span> <span className={
            props.data[fieldName] >= props.fieldThresholds[index][1]
            ? 'text-ew-500'
            : props.data[fieldName] <= props.fieldThresholds[index][0]
            ? 'text-ns-500'
            : ''}>{props.data[fieldName]}</span>
        </p>)}
        {isSkip && <p key={'skip'}>
          <span className={`font-bold ${isSkip ? 'animate-linear bg-[length:200%_auto] bg-gradient-to-r from-dt-500 to-dt-500 text-white p-1 rounded-md' : 'bg-gray-500/20  rounded-md p-1'}`}>Skip</span> <span className=""></span>
        </p>}
        </ul>
      </div>
    </motion.li>
  );
}