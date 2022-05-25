export class Cities {
    constructor(amount) {
        this.cities = Array(amount);
        for (let i = 0; i < amount; i++) {
            let x = Math.random() * 10;
            let y = Math.random() * 10;
            this.cities[i] = [x, y];
        }

        console.log(this.cities);
    }
}
