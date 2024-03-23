const COLORS: {[key: string]: string} = {
  EW: '#009645',
  NS: '#D42E12',
  NE: '#9900AA',
  CC: '#FA9E0D',
  DT: '#005EC4',
  TE: '#9D5B25',
  JR: '#97C616',
  SL: '#FF86FE',
  CR: '#23CAFC',
  MP: '#9B9900',
  TW: '#FC4D04',
  LRT: '#748477',

  NATURE: '#009645',
  LOOP: '#D42E12',
  FUTURE_NATURE: '#9D5B25',
  HYBRID: '#97C616',
  UNI: '#FF86FE',
  URBAN: '#23CAFC',
  MALLS: '#748477',
  FUTURE: '#FFFFFF',

  EW_BG: '#e6f5ec',
  EW_LIGHT: '#4db67d',
  EW_V_LIGHT: '#99d5b5',
  EW_DARK: '#006930',
  EW_V_DARK: '#003c1c',

  NS_BG: '#fbeae7',
  NS_LIGHT: '#e16d59',
  NS_V_LIGHT: '#eeaba0',
  NS_DARK: '#94200d',
  NS_V_DARK: '#551207',

  NE_BG: '#f5e6f7',
  NE_LIGHT: '#b84dc4',
  NE_V_LIGHT: '#d699dd',
  NE_DARK: '#6b0077',
  NE_V_DARK: '#3d0044',

  CC_BG: '#fff5e7',
  CC_LIGHT: '#fcbb56',
  CC_V_LIGHT: '#fdd89e',
  CC_DARK: '#af6f09',
  CC_V_DARK: '#643f05',

  DT_BG: '#e6eff9',
  DT_LIGHT: '#4d8ed6',
  DT_V_LIGHT: '#99bfe7',
  DT_DARK: '#004289',
  DT_V_DARK: '#00264e',

  TE_BG: '#f5efe9',
  TE_LIGHT: '#ba8c66',
  TE_V_LIGHT: '#d8bda8',
  TE_DARK: '#6e401a',
  TE_V_DARK: '#3f240f',

  JR_BG: '#e6f5f7',
  JR_LIGHT: '#4db8c4',
  JR_V_LIGHT: '#99d6dd',
  JR_DARK: '#006b77',
  JR_V_DARK: '#003d44',

  LRT_BG: '#f1f3f1',
  LRT_LIGHT: '#9EA9A0',
  LRT_V_LIGHT: '#C7CEC9',
  LRT_DARK: '#515C53',
  LRT_V_DARK: '#2E3530',

  WHITE: '#FFFFFF',
}

export const fromCategory = (category: string): string => {
  switch (category) {
    case 'apps':
      return 'ew';
    case 'portfolio':
      return 'ne';
    case 'quizzes':
      return 'ns';
    default:
      return 'lrt';
  }
}

const convertColor = (color: string) => {
  const hex = COLORS[color];
  if (!hex) {
    return '';
  }
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return [r,g,b];
};

export default convertColor;