export const getLocationColor = (colorComparator: string, locationType: string) => {
  switch (locationType) {
    case "mrt":
      return getMrtColor(colorComparator);
    case "schools":
      return getSchoolColor(colorComparator);
    case "cities":
    case "japan-cities":
    case "france-cities":
    case "china-cities":
    case "uk-cities":
    case "spain-cities":
    case "portugal-cities":
    case "italy-cities":
    case "india-cities":
    case "indonesia-cities":
    case "philippines-cities":
    case "usa-cities":
    case "canada-cities":
      return getCityColor(colorComparator);
    case "bus-stops":
      return getBusStopColor(colorComparator);
    case "london-underground":
      return getUndergroundColor(colorComparator);
  }
};

const getMrtColor = (colorComparator: string) => {
  const bracketRegex = /\([^)]*\)/gi;
  const bracketValues = colorComparator.match(bracketRegex);
  if (!bracketValues) return "lrt-500";
  const bracketValue = bracketValues[0];
  const key = bracketValue.match(/[A-Z]+/gi);
  if (!key) return "lrt-500";
  switch (key[0]) {
    case "EW":
    case "CG":
      return "ew-500";
    case "NS":
      return "ns-500";
    case "NE":
      return "ne-500";
    case "CC": 
    case "CE":
      return "cc-500";
    case "DT":
      return "dt-500";
    case "TE":
      return "te-500";
    case "JR":
    case "JE":
    case "JW":
    case "JS":
      return "jr-500";
    case "CR":
    case "CP":
      return "cr-500";
    default:
      return "lrt-500";
  }
}

const getSchoolColor = (colorComparator: string) => {
  const bracketRegex = /\([^)]*\)/gi;
  const bracketValues = colorComparator.match(bracketRegex);
  if (!bracketValues) return "lrt-500";
  const bracketValue = bracketValues[0];
  const key = bracketValue.match(/[A-Z]+/gi);
  if (!key) return "lrt-500";
  switch (key[0]) {
    case "Primary":
      return "white";
    case "Secondary":
      return "mp-300";
    default:
      return "mp-600";
  }
}

const getCityColor = (colorComparator: string) => {
  const bracketRegex = /\[[^\]]*\]/gi;
  const bracketValues = colorComparator.match(bracketRegex);
  if (!bracketValues) return "lrt-500";
  const bracketValue = bracketValues[0];
  if (bracketValue.includes("1M") || bracketValue.includes("10M")) return "hp-700";
  if (bracketValue.includes("100K")) return "hp-300";
  if (bracketValue.includes("10K")) return "hp-100";
  return "white";
}

const getBusStopColor = (colorComparator: string) => {
  const bracketRegex = /\[[^\]]*\]/gi;
  const bracketValues = colorComparator.match(bracketRegex);
  if (!bracketValues) return "lrt-500";
  const bracketValue = bracketValues[0];
  const commas = bracketValue.match(/,/g || [])?.length || 0;
  if (commas > 8) return "tw-700";
  if (commas > 5) return "tw-400";
  if (commas > 2) return "tw-200";
  return "white";
}

const getUndergroundColor = (colorComparator: string) => {
  const bracketRegex = /\([^)]*\)/gi;
  const bracketValues = colorComparator.match(bracketRegex);
  if (!bracketValues) return "white";
  const bracketValue = bracketValues[0];
  const key = bracketValue.match(/[A-Z]+/gi);
  if (!key) return "white";
  switch (key[0]) {
    case "District":
      return "dis-500";
    case "Piccadilly":
      return "pic-500";
    case "Metropolitan":
      return "met-500";
    case "Circle":
      return "cir-500";
    case "Hammersmith":
      return "ham-500";
    case "Northern":
      return "nor-500";
    case "Bakerloo":
      return "bak-500";
    case "Jubilee":
      return "jub-500";
    case "Waterloo":
      return "wat-500";
    case "Central":
      return "cen-500";
    case "Victoria":
      return "vic-500";
  }
}