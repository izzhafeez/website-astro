import React from 'react';
import type { TDescription, TDescriptionBlock } from "../../types/item";
import getStarScale from './StarScale';
import Link from './Link';

const LINK_REGEX = /<<(.*?)<\/>/ig;
const BOLD_REGEX = /\*\*/ig;

function parseBlock(block: TDescriptionBlock, category: string) {
  switch (block.title) {
    case 'link':
      return parseLinkSection(block.text, 'Visit Site');
    case 'repo':
      return parseLinkSection(block.text, 'Visit Repository');
    case 'proficiency':
    case 'complexity':
    case 'aesthetics':
      return parseProficiency(block, category);
    default:
      return parseParagraphSection(block, category);
  }
}

function parseLinkSection(link: string, text: string) {
  return <section key={link} className='mb-3'>
    {text}
  </section>;
};

function parseProficiency(block: TDescriptionBlock, category: string) {
  return <section key='proficiency'>
    <h3 className={`font-extrabold my-2 text-3xl text-${category}-500`}>{block.title?.toUpperCase()}</h3>
    <h3 className={'text-gray-300'}>{getStarScale(parseInt(block.text))}</h3>
  </section>
};

export function parseRaw(text: string) {
  const paragraphs = text.toString().split('\n');
  return paragraphs.map(removeFormatting).join('\n');
}

function parseParagraphSection(block: TDescriptionBlock, category: string) {
  const paragraphs = block.text.toString().split('\n');

  return <section className='text-start grid gap-2' key={block.title || block.text}>
    {block.title && block.title !== "description" && <h3 className={`font-extrabold text-3xl text-${category}-500 text-${category}-300`}>{block.title.toUpperCase()}</h3>}
    <div className='grid gap-2'>{paragraphs.map((x, i) => parseText(x, i))}</div>
  </section>;
};

function parseText(text: string, index: number) {
  return <><p key={index} className='text-gray-400'>{parseLinks(text)}</p></>;
}

function removeFormatting(text: string) {
  return text.replace(BOLD_REGEX, '').replace(/<<(.*?)>>/ig, '').replace(/<\/>/ig, '');
}

function parseLinks(text: string) {
  return text.split(LINK_REGEX).map((segment, index) => {
    if (index % 2 === 0) {
      return <span key={index}>{parseBold(segment)}</span>;
    }
    const [link, label] = segment.split(">>");
    const category = getCategoryFromLink(link);
    const categoryMatching: { [key: string]: string } = {
      portfolio: 'text-portfolio-500 text-portfolio-300',
      blog: 'text-blog-500 text-blog-300',
      quiz: 'text-quiz-500 text-quiz-300',
      "no-category": 'text-black text-white'
    }

    const className = `group transition duration-300 link-underline ${categoryMatching[category]}`
    
    return <>
      <Link category={category} className={className} text={label} href={link} key={link}/>
    </>;
  });
}

function getCategoryFromLink(link: string) {
  const possibleCategories = ['portfolio', 'blog', 'quiz'];
  for (let cat of possibleCategories) {
    if (link.includes(cat)) {
      return cat;
    }
  }

  return 'no-category';
}

function parseBold(text: string) {
  return text.split(BOLD_REGEX).map((segment, index) => {
    if (index % 2 === 0) {
      return <span key={index}>{segment}</span>;
    }
    return <b key={index} className='font-extrabold text-white'>{segment}</b>;
  });
}

class Description extends React.Component<{ description?: TDescription, category: string }> {
  render() {
    return <div className='grid gap-2'>{this.props.description?.map(block => parseBlock(block, this.props.category))}</div>;
  }
}

export default Description;