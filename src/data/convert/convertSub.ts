const convertSub = (sub: string): string => {
    return {
        SPA: "Spain", TUR: "Turkey", RUS: "Russia", GBR: "United Kingdom", GER: "Germany",
        GRE: "Greece", UKR: "Ukraine", ITA: "Italy", FRA: "France", POL: "Poland",
        SWE: "sweden", BLG: "belgium", NET: "netherlands", SWI: "switzerland", AUS: "austria",
        BUL: "bulgaria", CZE: "czech republic", HUN: "hungary", ROM: "romania", NOR: "norway",
        SER: "serbia", FIN: "finland", POR: "portugal", DEN: "denmark", SVN: "slovenia",
        MAL: "malta", EST: "estonia", LIT: "lithuania", LAT: "latvia", IRE: "ireland",
        LUX: "luxembourg", ISL: "iceland", AND: "andorra", MON: "montenegro", MLT: "malta",
        CRO: "croatia", SVK: "slovakia", BOS: "bosnia and herzegovina", ALB: "albania",
        MOL: "Moldova", MAC: "North Macedonia", KOS: "Kosovo", BEL: "Belarus", AZE: "Azerbaijan",
        CYP: "Cyprus", WY: "Wyoming", NE: "Nebraska", NM: "New Mexico", KS: "Kansas",
        ID: "Idaho", HI: "Hawaii", ME: "Maine", RI: "Rhode Island", VT: "Vermont",
        ND: "North Dakota", SD: "South Dakota", MT: "Montana", DE: "Delaware",
        AK: "Alaska", WV: "West Virginia", NH: "New Hampshire", MS: "Mississippi",
        MI: "Michigan", IA: "Iowa", CT: "Connecticut", OR: "Oregon", SC: "South Carolina",
        KY: "Kentucky", LA: "Louisiana", AR: "Arkansas", TN: "Tennessee", MO: "Missouri",
        IN: "Indiana", OH: "Ohio", IL: "Illinois", WI: "Wisconsin", PA: "Pennsylvania",
        NC: "North Carolina", VA: "Virginia", GA: "Georgia", FL: "Florida", TX: "Texas",
        CA: "California", WA: "Washington", NY: "New York", NJ: "New Jersey", MA: "Massachusetts",
        MD: "Maryland", CO: "Colorado", UT: "Utah", AZ: "Arizona", MN: "Minnesota",
        AL: "Alabama"
    }[sub] || sub;
}

export default convertSub;