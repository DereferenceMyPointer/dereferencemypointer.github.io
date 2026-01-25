/**
 * EventGenerator.js
 * 
 * Generates and plays events based on the game's state.
 * Also serves as a state machine for nested regions and locations.
 * 
 */

import { Damage } from "./Combatant.js";
import { AdvancedEnemy, BasicEnemy } from "./Enemies.js";
import { Fight } from "./Fight.js";

export class EventGenerator {

    constructor() {
        this.visitedTiles = new Set();
        this.scavengedTiles = new Set();
        this.currentTile = [0, 0];
        this.scavengeSuccessRate = 1.3;
        this.scavengePunishRate = 0.1;
    }

    addTileToSet(tile, set) {
        set.add(`${tile[0]},${tile[1]}`);
    }

    checkTileInSet(tile, set) {
        return set.has(`${tile[0]},${tile[1]}`);
    }

    async moveEvent(dx, dy, game) {
        // Plays events based on the game's state when entering a location
        game.narrator.clear();
        const newX = this.currentTile[0] + dx;
        const newY = this.currentTile[1] + dy;
        this.currentTile = [newX, newY];
        await game.narrator.narrate([`You move to (${newX}, ${newY}).`]);
        if (!this.checkTileInSet(this.currentTile, this.visitedTiles)) {
            await game.narrator.narrate(["This is uncharted territory."]);
            this.addTileToSet(this.currentTile, this.visitedTiles);
        } else {
            await game.narrator.narrate(["This place feels familiar..."]);
        }
    }

    async forage(game) {
        game.narrator.clear();
        if (this.checkTileInSet(this.currentTile, this.scavengedTiles)) {
            await game.narrator.narrate(["Signs of your handiwork already litter the area. There's nothing more to find here."]);
            return;
        }
        await game.narrator.narrate([this.scavengeStrings[Math.floor(Math.random() * this.scavengeStrings.length)]]);
        if (Math.random() < this.scavengeSuccessRate) {
            await this.giveForageItem(game);
            this.addTileToSet(this.currentTile, this.scavengedTiles);
        } else if (Math.random() < this.scavengePunishRate) {
            await game.narrator.narrate(this.scavengePunishLists[Math.floor(Math.random() * this.scavengePunishLists.length)]);
            game.player.damage(new Damage({psychic: 5}), game.narrator);
            await game.narrator.narrate(["The " + game.player.name + " has " + game.player.sanity + " sanity remaining."]);
        } else {
            await game.narrator.narrate([this.scavengeFailStrings[Math.floor(Math.random() * this.scavengeFailStrings.length)]]);
        }
    }

    async giveForageItem(game) {
        // Give the player an item from foraging
        let enemy = new BasicEnemy();
        let fight = new Fight(game.player, enemy, game);
        game.narrator.narrateInstant(["In your state of focus, you were ambushed by a " + enemy.name + "!"]);
        await fight.start();
    }

    async fight(game) {
        let enemy = new AdvancedEnemy();
        let fight = new Fight(game.player, enemy, game);
        await fight.start();
    }

    scavengeStrings = [
        "You try to forage here. Perhaps you'll find something useful...",
        "You put your hands to good work scavenging the area...",
        "You search the area for anything of value...",
    ];
    scavengeFailStrings = [
        "But there is nothing to be found here.",
        "You come back tired, cold, and empty-handed. You're not sure this was worth it...",
        "Your efforts bear no fruit. The ground here is hard and unforgiving.",
    ];
    scavengePunishLists = [
        [
            "You stumble upon a horrifying sight!",
            "Just beneath your own two feet was a buried human head!",
            "Its orifices ooze a pungent, grey substance.",
            "Disgusted, you cover the hole.",
            "You can\'t take much more of this..."
        ]
    ]

}