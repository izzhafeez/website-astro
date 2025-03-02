export const getLocationColor = (colorComparator: string, locationType: string) => {
  switch (locationType) {
    case "mrt":
      return getMrtColor(colorComparator);
    case "schools":
      return getSchoolColor(colorComparator);
    case "cities":
    case "cities-asia":
    case "cities-europe":
    case "cities-north-america":
    case "cities-oceania":
    case "cities-south-america":
    case "cities-africa":
      return getCityColor(colorComparator);
    case "bus-stops":
      return getBusStopColor(colorComparator);
    case "london-underground":
      return getUndergroundColor(colorComparator);
    case "malls":
      return getMallColor(colorComparator);
    case "tokyo-metro":
      return getMetroColor(colorComparator);
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
  if (bracketValue.includes("10M")) return "ne-300";
  if (bracketValue.includes("5M")) return "dt-300";
  if (bracketValue.includes("2M")) return "ew-300";
  if (bracketValue.includes("1M")) return "ns-300";
  if (bracketValue.includes("500K")) return "cc-700";
  if (bracketValue.includes("200K")) return "cc-500";
  if (bracketValue.includes("100K")) return "cc-300";
  if (bracketValue.includes("75K")) return "cc-100";
  if (bracketValue.includes("50K")) return "white";
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

const getMetroColor = (colorComparator: string) => {
  const bracketRegex = /\([^)]*\)/gi;
  const bracketValues = colorComparator.match(bracketRegex);
  if (!bracketValues) return "white";
  const bracketValue = bracketValues[0];
  const key = bracketValue.match(/[A-Z]+/gi);
  if (!key) return "white";
  switch (key[0]) {
    case "Hanzoumon":
      return "han-500";
    case "Touzai":
      return "tou-500";
    case "Fukutoshin":
      return "fuk-500";
    case "Chiyoda":
      return "chi-500";
    case "Hibiya":
      return "hib-500";
    case "Yuurakuchou":
      return "yur-500";
    case "Marunouchi":
      return "mar-500";
    case "Ginza": 
      return "gin-500";
    case "Namboku":
      return "nam-500";
  }
}

const getMallColor = (colorComparator: string) => {
  const bracketRegex = /\[[^\]]*\]/gi;
  const bracketValues = colorComparator.match(bracketRegex);
  if (!bracketValues) return "lrt-mrt";
  const bracketValue = bracketValues[0];
  if (bracketValue.includes("300S")) return "ns-500";
  if (bracketValue.includes("200S")) return "ns-300";
  if (bracketValue.includes("100S")) return "white";
  if (bracketValue.includes("50S")) return "ew-300";
  return "ew-300";
}