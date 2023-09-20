function generateRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function generateData(n, min = 0, max = 100) {
    let data = new Array(n)

    for (let i = 0; i < n; i++) {
        data[i] = {
            id: i + 1,
            rank: i + 1,
            value: generateRandomInt(min, max),
            color: 0,
        }
    }

    return data
}