function seededRandom(seed: number): () => number {
    let value = seed % 2147483647;
    if (value <= 0) value += 2147483646;
    return function() {
        value = (value * 16807) % 2147483647;
        return value / 2147483647;
    };
};

export function shuffle(array: any[], randomiser: () => number): any[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(randomiser() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export default seededRandom;