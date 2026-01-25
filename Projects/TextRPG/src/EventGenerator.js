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
import { Consumables } from "./Items.js";

const sanityEventLines = [
    ["There is something uncanny afoot here.",
    "You're not sure your constitution is strong enough to take this..."],
    ["The sky above twists and turns. The howling of the wind is deeply unnatural.",
    "Was it really such a good idea to come here?"],
    ["The ground you tread on shows strange signs of wear. Unusually large footprints mark the forest floor.",
    "You feel your mental faculties slipping..."]
]

export class EventGenerator {

    constructor() {
        this.visitedTiles = new Set();
        this.scavengedTiles = new Set();
        this.currentTile = [0, 0];
        this.scavengeSuccessRate = 0.3;
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

        if (Math.random() < 0.5) {
            await game.narrator.narrate(["This area is suspiciously devoid of threats."])
            return;
        }
        let repetitions = 1;
        if (Math.abs(this.currentTile[0]) + Math.abs(this.currentTile[1]) > 9)
            repetitions++;
        for (let i = 0; i < repetitions; i++) {
            if (Math.random() < 0.2) {
                await this.sanityEvent(game);
            }
            if (Math.random() < 0.25) {
                if (Math.abs(this.currentTile[0]) + Math.abs(this.currentTile[1]) > 15) {
                    await this.boss(game);
                    return;
                }
                if (Math.abs(this.currentTile[0]) + Math.abs(this.currentTile[1]) > 6 && Math.random() < 0.3)
                    if (!await this.ambushEvent(game, "medium")) return;
                else
                    if (!await this.ambushEvent(game, "easy")) return;
            }
            if (Math.abs(this.currentTile[0]) + Math.abs(this.currentTile[1]) > 6 && Math.random() < 0.7)
                if (!await this.encounter(game, "medium")) return;
            else
                if (!await this.encounter(game, "easy")) return;
        }
    }

    async encounter(game, mode) {
        let enemy;
        if (mode === "easy")
            enemy = new BasicEnemy();
        else
            enemy = new AdvancedEnemy("miniboss");
        await game.narrator.narrate([
            "You see a " + enemy.name + " up ahead.",
            "How do you respond?"
        ]);
        game.narrator.narrateInstant(["1: Attack!\n2: Sneak around it"]);
        let s = await game.awaitInput();
        s = parseInt(s);
        if (s == 2) {
            if (Math.random() < 0.75) return;
            let fight = new Fight(game.player, enemy, game);
            await game.narrator.narrate([`You were ambushed by the ${enemy.name}!`])
            return await fight.start(true);
        }
        await game.narrator.narrate([`You attack the ${enemy.name}!`])
        let fight = new Fight(game.player, enemy, game);
        return await fight.start();
    }

    async boss(game) {
        let enemy = new AdvancedEnemy("boss");
        await game.narrator.narrate(["The ground beneath you is quaking..."]);
        await game.narrator.narrate(["An enormous being erupts from the earth!"]);
        await game.narrator.narrate(["That is no mere creature of the forest... this being is closer to a god!"]);
        if (await new Fight(game.player, enemy, game).start()) {
            await game.narrator.narrate(["You win, for now...", "But the soul of Aleria lives on.", "", "Congratulations on beating the alpha!"]);
        }
        game.over = true;
    }

    async ambushEvent(game, mode) {
        let enemy;
        if (mode === "easy") {
            enemy = new BasicEnemy();
            await game.narrator.narrate([`You were ambushed by a ${enemy.name}!`]);
        } else if (mode === "medium") {
            enemy = new AdvancedEnemy("miniboss");
            await game.narrator.narrate(["A tall figure rises from the shadows...", "A freak of nature towers before you!"]);
        }
        return await new Fight(game.player, enemy, game).start();
    }

    async sanityEvent(game) {
        await game.narrator.narrate(sanityEventLines[Math.floor(Math.random() * sanityEventLines.length)]);
        game.player.damage(new Damage({psychic: 10}));
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
        } else if (Math.random() < this.scavengePunishRate) {
            await game.narrator.narrate(this.scavengePunishLists[Math.floor(Math.random() * this.scavengePunishLists.length)]);
            game.player.damage(new Damage({psychic: 5}), game.narrator);
            await game.narrator.narrate(["The " + game.player.name + " has " + game.player.sanity + " sanity remaining."]);
        } else {
            await game.narrator.narrate([this.scavengeFailStrings[Math.floor(Math.random() * this.scavengeFailStrings.length)]]);
        }
        this.addTileToSet(this.currentTile, this.scavengedTiles);
    }

    async giveForageItem(game) {
        // Give the player an item from foraging
        if (Math.random() < 0.08) {
            await game.narrator.narrate(["Something sparkles beneath the dirt..."]);
            await game.narrator.narrate(["A topaz-blue stone shines on your fingertips."]);
            await game.narrator.narrate(["Its surface is smooth and cool to the touch."]);
            await game.narrator.narrate(["As you study it, cracks begin to form..."]);
            await game.narrator.narrate(["The stone crumbles to dust against your skin."]);
            await game.narrator.narrate(["You feel as though your wits have sharpened."]);
            game.player.agility += 1;
        } else if (Math.random() < 0.1) {
            await game.narrator.narrate(["You brush aside a thin layer of dirt..."]);
            await game.narrator.narrate(["Beneath it is a patch of snow!"]);
            await game.narrator.narrate(["A shiver washes over your body."]);
            await game.narrator.narrate(["The snow melts over your fingers, and you feel a sudden warmth pushing against the cold..."]);
            await game.narrator.narrate(["You feel more resilient."]);
            game.player.iceTolerance += 2;
        } else if (Math.random() < 0.12) {
            await game.narrator.narrate([
                "You don't find anything in particular.",
                "However, the landscape is pleasant.",
                "You feel your outlook improving..."
            ]);
            game.player.maxHP += 2;
        } else {
            await game.narrator.narrate(["Buried nearby is a Greater Healing Flask!"]);
            game.player.inventory["consumables"].push(Consumables[0]);
        }
        game.player.damage(new Damage({heal: 3, mindHeal: 5}));
    }

    async fight(game) {
        await this.boss(game);
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