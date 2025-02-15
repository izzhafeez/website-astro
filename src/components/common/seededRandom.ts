function seededRandom(seed: number): () => number {
    let value = seed % 2147483647;
    if (value <= 0) value += 2147483646;
    return function() {
        value = (value * 16807) % 2147483647;
        return value / 2147483647;
    };
};

export default seededRandom;