export const getColor = (mapType: string, comparator: string|number) => {
  if (mapType === "mrt") {
    return getMrtColor(comparator as string);
  }

  if (mapType === "city") {
    return getCityColor(comparator as number);
  }
}

const getMrtColor = (comparator: string) => {
  const bracketRegex = /\([^)]*\)/gi;
  const bracketValues = comparator.match(bracketRegex);
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
      return "white";
  }
}

const getCityColor = (comparator: number) => {
  const thresholds = {
    10000000: "ne-700",
    7500000: "ne-400",
    5000000: "dt-700",
    2500000: "dt-400",
    1000000: "dt-200",
    750000: "ns-700",
    500000: "ns-500",
    250000: "ns-300",
    100000: "ns-100",
    75000: "cc-700",
    50000: "cc-500",
    25000: "cc-300",
    10000: "cc-100",
    7500: "cr-700",
    5000: "cr-500",
    2500: "cr-300",
    1000: "cr-100",
    0: "white"
  }

  for (const threshold of Object.keys(thresholds).reverse()) {
    if (comparator >= parseInt(threshold)) {
      return (thresholds as any)[threshold];
    }
  }
}