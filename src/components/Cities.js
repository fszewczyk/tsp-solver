export class Cities {
    constructor(amount, cities) {
        if (cities == undefined) {
            this.cities = Array(amount);
            for (let i = 0; i < amount; i++) {
                let x = Math.random();
                let y = Math.random();
                this.cities[i] = [x, y];
            }
        } else {
            this.cities = cities;
        }
    }
}

export function createCities(amount, cities = undefined) {
    return new Cities(amount, cities);
}
