export function distance(a, b) {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
}

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
            let d = distance(cities[this.path[i]], cities[this.path[i - 1]]);
            this.distance += d;
        }
        this.distance += distance(cities[this.path[0]], cities[this.path[this.length - 1]]);
        this.fitness = 0;
    }

}

export function createPath(amount, map, path = undefined) {
    return new Path(amount, map, path);
}
