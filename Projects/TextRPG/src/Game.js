import { Overworld } from "./EventGenerator.js";
import { BossWeapons } from "./Items.js";
import { Player } from "./Player.js";

/**
 * Generic game class. Executes a game loop and has modular components.
 * 
 */

export class Game {
    constructor(narrator, worldName, playerName="Player") {
        this.narrator = narrator;
        this.worldName = worldName;

        this.busy = false;
        this.over = false;
        this._inputResolver = null;

        this.eventGenerator = new Overworld();
        this.player = new Player(playerName);
    }

    async start() {
        await this.narrator.narrate([
            "Welcome to the hidden world of " + this.worldName + "!",
            "A vast forest sprawls before you.",
            "Icy mountain peaks tower in the distance.",
            "A setting sun casts rosy hues across a cold but beautiful landscape.",
            "These lands were not meant for you, but you are here nonetheless.",
            "",
            "The way ahead is clear. What action will you take?"
        ]);
    }

    async awaitInput() {
        return new Promise((resolve) => {
            this._inputResolver = resolve;
        });
    }

    async takeInput(s) {
        console.log("Game received input: ", s);
        console.log("Game status: ", this.busy, this._inputResolver);
        if (this.over) return;
        if (s === '') return;
        if (this.busy) {
            if (this._inputResolver) {
                this._inputResolver(s);
                this._inputResolver = null;
            }
        } else {
            this.takeAction(s);
        }
    }

    // Process a player action
    // Intended to occur on text submit
    async takeAction(s) {
        if (this.busy) {
            console.log("Game is busy, cannot take action now.");
            return;
        }
        this.busy = true;
        this.narrator.clear();
        switch(s) {
            case 'north':
            case 'n':
                await this.move(0, 1);
                break;
            case 'south':
            case 's':
                await this.move(0, -1);
                break;
            case 'east':
            case 'e':
                await this.move(1, 0);
                break;
            case 'west':
            case 'w':
                await this.move(-1, 0);
                break;
            case 'forage':
            case 'scavenge':
            case 'search':
            case 'f':
                await this.eventGenerator.forage(this);
                break;
            case 'meditate':
            case 'm':
                await this.eventGenerator.meditate(this);
                break;
            case 'inventory':
            case 'inv':
            case 'i':
                let stop = true;
                while (stop) {
                    stop = await this.player.useInventory(this);
                }
                break;
            case 'help':
                await this.help();
                break;
            case 'fight':
                await this.eventGenerator.fight(this);
                break;
            case 'enter_debug':
                this.player.maxHP = 999;
                this.player.currentHP = 999;
                this.player.agility = 4;
                this.player.sanity = 499;
                this.player.inventory.weapons.push(BossWeapons.Erythel);
                break;
            default:
                await this.narrator.narrate(["That doesn't seem to work."]);
                break;
        }
        if (this.player.sanity <= 0) {
            await this.narrator.narrate(["You lost your mind."])
            this.over = true;
        }
        if (this.player.currentHP <= 0) {
            await this.narrator.narrate(["You died."]);
            this.over = true;
        }
        if (this.over) return;
        await this.narrator.narrate(["The way ahead is clear. What action will you take?"]);
        this.busy = false;
    }

    async help() {
        await this.narrator.narrate([
            "Available commands:",
            "  north/n - Move north",
            "  south/s - Move south",
            "  east/e - Move east",
            "  west/w - Move west",
            "  arrow keys - Move immediately",
            "  forage/f - Forage for items",
            "  meditate/m - Meditate",
            "  inventory/inv/i - Inventory"
        ]);
    }

    async move(dx, dy) {
        await this.eventGenerator.moveEvent(dx, dy, this);
    }

}