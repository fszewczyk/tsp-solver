export class Cities {
    constructor(amount) {
        this.cities = Array(amount);
        for (let i = 0; i < amount; i++) {
            let x = Math.random();
            let y = Math.random();
            this.cities[i] = [x, y];
        }
    }
}

export function createCities(amount) {
    return new Cities(amount);
}
