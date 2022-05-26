export class Path {
    constructor(length, cities, path = undefined) {
        this.length = length;

        if (path != undefined) {
            this.path = path;
        } else {
            this.path = Array(length);
            for (let i = 0; i < length; i++) {
                this.path[i] = i;
            }
            this.path = this.path
                .map(value => ({ value, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map(({ value }) => value)

        }

        this.distance = 0;
        for (let i = 1; i < this.path.length; i++) {
            let d = Math.pow(cities[this.path[i]][0] - cities[this.path[i - 1]][0], 2);
            d += Math.pow(cities[this.path[i]][1] - cities[this.path[i - 1]][1], 2);
            d = Math.sqrt(d);
            this.distance += d;
        }
    }

}

export function createPath(amount, map, path = undefined) {
    return new Path(amount, map, path);
}
