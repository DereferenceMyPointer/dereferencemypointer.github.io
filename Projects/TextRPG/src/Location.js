import { KeyItems } from "./Items.js";
import { Damage } from "./Combatant.js";

export class Location {
    constructor() {
        this.visitedTiles = new Set();
        this.scavengedTiles = new Set();
        this.meditatedTiles = new Set();
        this.wormHoles = new Map(); // tile, Location
        this.currentTile = [0, 0];
        this.scavengeSuccessRate = 0.3;
        this.scavengePunishRate = 0.1;
        this.name = "???";
    }

    getTile(tile) {
        return `${tile[0]},${tile[1]}`;
    }

    addTileToSet(tile, set) {
        set.add(`${tile[0]},${tile[1]}`);
    }

    checkTileInSet(tile, set) {
        return set.has(`${tile[0]},${tile[1]}`);
    }

    async moveEvent(dx, dy, game, hideCoord=false) {
        game.narrator.clear();
        let newX = this.currentTile[0] + dx;
        let newY = this.currentTile[1] + dy;
        this.currentTile = [newX, newY];
        if (hideCoord) {
            newX = '???'
            newY = '???'
        }
        await game.narrator.narrate([`You move to (${newX}, ${newY}) in ${this.name}.`]);
    }
    async forage(game) {}
    async meditate(game) {}
    async sanityEvent(game) {}
}

export class Caves extends Location {
    constructor(origin) {
        super()
        this.bounds = [6, -6]
        this.origin = origin
        this.name = "the hidden cave system";
    }

    async moveEvent(dx, dy, game) {
        await super.moveEvent(dx, dy, game, true);
        if (this.currentTile[0] > this.bounds[0] ||
            this.currentTile[0] < this.bounds[1] ||
            this.currentTile[1] > this.bounds[0] ||
            this.currentTile[1] < this.bounds[1]
        ) {
            await game.narrator.narrate([
                "Around the next bend you see a faint glimmer of light...",
                "Before you is a path to the surface!",
                "",
                "These caves seem to end here. You managed to return alive."]);
            game.eventGenerator = this.origin;
            return;
        }
        await game.narrator.narrate(["You venture further into the depths... the darkness toys with your senses."])
        game.player.damage(new Damage({psychic: 2}));
    }

    async forage(game) {
        game.narrator.clear();
        await game.narrator.narrate([`On your hands and knees, you blindly scavenge the cave floor...`]);
        if (!this.checkTileInSet(this.currentTile, this.meditatedTiles)) {
            if (Math.random() < 0.1 && game.player.giveKeyItem(KeyItems.CloudKey)) {
                await game.narrator.narrate([
                    `Something cold and metallic graces your fingertips.`,
                    `It has the shape of a key...`,
                    `Engraved in its handle are the sweeping shapes of the clouds.`,
                    `You found the Cloud Key.`,
                ]);
                game.narrator.buffer();
            }
            if (Math.random() < 0.1 && game.player.giveKeyItem(KeyItems.DeathKey)) {
                await game.narrator.narrate([
                    `Something cold and metallic graces your fingertips.`,
                    `It has the shape of a key...`,
                    `Engraved in its handle is the skull of an unknown entity.`,
                    `You found the Death Key.`
                ]);
                game.narrator.buffer();
            }
        }
    }

}



export class AstralPlane extends Location {
    constructor(origin){
        super();
        this.origin = origin;
        this.currentTile[0] = Math.floor(origin.currentTile[0] / 8);
        this.currentTile[1] = Math.floor(origin.currentTile[1] / 8);
        this.name = "the Pseudoastral Plane";
    }
    
    async moveEvent(dx, dy, game) {
        await super.moveEvent(dx, dy, game);
        await game.narrator.narrate(["You traverse the barren white..."]);
    }

    async meditate(game) {
        await game.narrator.narrate([
            "You close your eyes to focus...", 
            "As you do, your previous surroundings reappear in your mind.",
            "You can feel the same air against your skin. Its sounds once again begin to sing in your ears...",
            `You returned to ${this.origin.name}.`
        ]);
        console.log(this.origin);
        this.origin.currentTile[0] = this.currentTile[0] * 8;
        this.origin.currentTile[1] = this.currentTile[1] * 8;
        game.eventGenerator = this.origin;
    }

}