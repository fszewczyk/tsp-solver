import { Cities } from "./Cities";
import { Path } from "./Path";

export function createCities(amount) {
    return new Cities(amount);
}

export function createPath(amount, map, path = undefined) {
    return new Path(amount, map, path);
}
