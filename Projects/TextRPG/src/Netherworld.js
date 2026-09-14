import { Location } from "./Location.js";

export class Netherworld extends Location {
    constructor(origin) {
        super();
        this.name = "The Netherworld";
        this.origin = origin;
    }
    async moveEvent(dx, dy, game) {
        await super.moveEvent(dx, dy, game, true);
    }
}