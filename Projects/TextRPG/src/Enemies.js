/**
 * 
 * Enemies.js
 * 
 * Enemy definitions.
 * 
 */

import { Damage, Combatant } from "./Combatant.js";

const basicEnemies = [
    { "name": "Stick-shaped Insect", "maxHP": 20 , "weapon": {"name": "Chirp", "damage": new Damage({physical: 5})} },
    { "name": "Pygmy Elf", "maxHP": 15, "weapon": {"name": "Vicious Scratch", "damage": new Damage({physical: 8})} },
    { "name": "Firefly Swarm", "maxHP": 22, "weapon": {"name": "Burning Aura", "damage": new Damage({burning: 4})} },
    { "name": "Forest Nymph", "maxHP": 18, "weapon": {"name": "Claws", "damage": new Damage({physical: 8})} },
    { "name": "Large Toad", "maxHP": 25, "weapon": {"name": "Tongue", "damage": new Damage({physical: 4})} },
    { "name": "Will O\' the Wisp", "maxHP": 10, "weapon": {"name": "Ignition", "damage": new Damage({burning: 6})} },
    { "name": "Ember Pixie", "maxHP": 10, "weapon": {"name": "Firebolt", "damage": new Damage({physical: 4, burning: 2})}}
]

export class BasicEnemy extends Combatant {
    constructor(name, maxHP, resistances = new Damage(), sanity = 10, agility = 1, iceTolerance = 5) {
        super(name, maxHP, resistances, sanity, agility, iceTolerance);

        const enemyData = basicEnemies[Math.floor(Math.random() * basicEnemies.length)];
        this.name = enemyData.name;
        this.weapon = enemyData.weapon;
        this.maxHP = enemyData.maxHP;
        this.currentHP = this.maxHP;
    }
    async takeCombatTurn(enemy, game) {
        const skipped = await super.takeCombatTurn(self, enemy, game);
        if (skipped) return true;
        await game.narrator.narrate([`${this.name} attacks with its ${this.weapon.name}!`]);
        await enemy.damage(this.weapon.damage);
        return true;
    }
}

const advancedEnemies = [
    // Advanced enemies can be defined here
    { "name": "Inferno Raindeer", "maxHP": 40, "agility": 2, "attacks": [
        {"name": "Trample", "damage": new Damage({physical: 16}), "lines": [
            "The Inferno Raindeer tramples you with its hooves!",
        ]},
        {"name": "Tornado of Flames", "damage": new Damage({burning: 8}), "lines": [
            "The Infeerno Raindeer thrashes about with its antlers, enveloping you in a pillar of flame!",
        ]}
    ] },
    { "name": "Frost Wyvern", "maxHP": 35, "agility": 2, "attacks": [
        {"name": "Slash", "damage": new Damage({physical: 12, ice: 4}), "lines": [
            "The Frost Wyvern slashes at you with its claws! You feel an otherworldly chill!",
        ]},
        {"name": "Retreat", "heal": new Damage({heal: 8}), "lines": [
            "The Frost Wyvern pulls back! It takes the opportunity to heal!",
        ]}
    ] },
    { "name": "Erythel, Dragon Hand of the World Soul", "maxHP": 190,"agility": 2, "attacks": [
        {"name": "Claw", "damage": new Damage({physical: 32}), "lines": [
            "Erythel swipes at you viciously with its claws! The pain is unbearable!",
        ]}
    ]}
]
export class AdvancedEnemy extends Combatant {
    constructor(name, maxHP, resistances = new Damage(), sanity = 15, agility = 2, iceTolerance = 7) {
        super(name, maxHP, resistances, sanity, agility, iceTolerance);
        const data = advancedEnemies[Math.floor(Math.random() * advancedEnemies.length)]
        this.name = data.name;
        this.maxHP = data.maxHP;
        this.currentHP = this.maxHP;
        this.attacks = data.attacks;
        this.agility = data.agility || agility;
    }

    async takeCombatTurn(enemy, game) {
        const skipped = await super.takeCombatTurn(enemy, game);
        if (skipped) return true;
        const attack = this.attacks[Math.floor(Math.random() * this.attacks.length)];
        await game.narrator.narrate(attack.lines);
        if ("heal" in attack)
            this.damage(attack.heal);
        if ("damage" in attack)
            enemy.damage(attack.damage);
    }

}