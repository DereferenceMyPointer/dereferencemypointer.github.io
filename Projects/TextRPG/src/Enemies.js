/**
 * 
 * Enemies.js
 * 
 * Enemy definitions.
 * 
 */

import { Damage, Combatant } from "./Combatant.js";
import { Consumables, Weapons, Armor, LowTierConsumables, LowTierWeapons, LowTierArmor, HighTierConsumables, HighTierWeapons, HighTierArmor, BossWeapons } from "./Items.js";

const basicEnemies = [
    { "name": "Stick-shaped Insect", "maxHP": 20 , "weapon": {"name": "Chirp", "damage": new Damage({physical: 5})}},
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
        this.lootPool = {consumables: LowTierConsumables, weapons: LowTierWeapons, armor: LowTierArmor};
    }
    async takeCombatTurn(enemy, game) {
        const skipped = await super.takeCombatTurn(self, enemy, game);
        if (skipped) return true;
        await game.narrator.narrate([`${this.name} attacks with its ${this.weapon.name}!`]);
        await enemy.damage(this.weapon.damage);
        return true;
    }

    loot() {
        if (Math.random() < 0.15) {
            return ["consumables", this.lootPool.consumables[Math.floor(Math.random() * this.lootPool.consumables.length)]];
        }
        if (Math.random() < 0.15) {
            return ["weapons", this.lootPool.weapons[Math.floor(Math.random() * this.lootPool.weapons.length)]];
        }
        if (Math.random() < 0.15) {
            return ["armor", this.lootPool.armor[Math.floor(Math.random() * this.lootPool.armor.length)]];
        }
        return [null, null];
    }
}

const advancedEnemies = [
    // Advanced enemies can be defined here
    { "name": "Inferno Raindeer", "maxHP": 40, "agility": 2, "icetolerance": 5, "attacks": [
        {"name": "Trample", "damage": new Damage({physical: 16}), "lines": [
            "The Inferno Raindeer tramples you with its hooves!",
        ]},
        {"name": "Tornado of Flames", "damage": new Damage({burning: 8}), "lines": [
            "The Infeerno Raindeer thrashes about with its antlers, enveloping you in a pillar of flame!",
        ]}
    ] },
    { "name": "Frost Wyvern", "maxHP": 35, "agility": 2, "icetolerance": 15, "attacks": [
        {"name": "Bite", "damage": new Damage({physical: 18, ice: 3}), "lines": [
            "The Frost Wyvern snaps at you with its teeth! You feel an otherworldly chill!",
        ]},
        {"name": "Retreat", "heal": new Damage({heal: 12}), "lines": [
            "The Frost Wyvern pulls back! It takes the opportunity to heal!",
        ]}
    ] },
    { "name": "Behemoth Troll", "maxHP": 44, "agility": 1, "icetolerance": 8, "attacks": [
        {"name": "Smash", "damage": new Damage({physical: 22, psychic: 1}), "lines": [
            "The Behemoth Troll clubs you with an enormous fist! Your head is spinning!",
        ]},
        {"name": "Retreat", "heal": new Damage({heal: 12, burnHeal: 20}), "lines": [
            "The Behemoth Troll backs off! It seems to be recovering rather quickly!",
        ]},
        {"name": "Bellow", "buff": new Damage({physical: 4, psychic: 6}), "lines": [
            "A bellow of unbelievable magnitude escapes the beast! Its eyes burn with rage!",
        ]}
    ] },
]

const highTierLoot = {consumables: HighTierConsumables, weapons: HighTierWeapons, armor: HighTierArmor, keyItems: [null]
};

export const bossLoot = { consumables: [null], weapons: BossWeapons, armor: [null], keyItems: [null] };

export const BossEnemies = [
    { "name": "Erythel, Dragon Hand of the World Soul", "maxHP": 190, sanity: 24, "agility": 2, "icetolerance": 10, "attacks": [
        {"name": "Claw", "damage": new Damage({physical: 32}), "lines": [
            "Erythel swipes at you viciously with its claws! The pain is unbearable!",
        ], "weight": 3},
        {"name": "Buff", "buff": new Damage({burning: 8, ice: 8}), "lines": [
            "A wreath of ice and flame envelops Erythel! Some kind of ritual is underway!",
        ], "weight": 1},
        {"name": "Heal", "heal": new Damage({heal: 36, burnHeal: 6}), "lines": [
            "Erythel withdraws, taking the opportunity to heal!",
        ], "weight": 1},
        {"name": "Debuff", "damage": new Damage({ice: 4, psychic: 5}), "lines": [
            "Erythel hits you with a powerful icy blast! A splitting headache rages between your temples!",
        ], "weight": 1},
    ]}
]

export class AdvancedEnemy extends Combatant {
    constructor(enemyPool=advancedEnemies, lootPool = highTierLoot, index=0,resistances = new Damage(), sanity = 15, agility = 2, iceTolerance = 7, lootChance = 0.15) {
        super("", 0, resistances, sanity, agility, iceTolerance);
        this.lootPool = lootPool;
        const data = enemyPool[Math.floor(Math.random() * enemyPool.length)]
        this.name = data.name;
        this.maxHP = data.maxHP;
        this.currentHP = this.maxHP;
        this.attacks = data.attacks;
        this.agility = data.agility || agility;
        this.sanity = data.sanity || sanity;
        this.iceTolerance = data.icetolerance || iceTolerance;
        this.buff = new Damage();
        this.lootChance = lootChance;
        let temp = []
        console.log("Adv Enemey constructor.", this.attacks);
        for (const attack of data.attacks) {
            for (let i = 0; i < (attack.weight || 1); i++) {
                temp.push(attack);
            }
        }
        this.attacks = temp;
    }

    async takeCombatTurn(enemy, game) {
        const skipped = await super.takeCombatTurn(enemy, game);
        if (skipped) return true;
        const attack = this.attacks[Math.floor(Math.random() * this.attacks.length)];
        await game.narrator.narrate(attack.lines);
        if ("heal" in attack)
            this.damage(attack.heal);
        if ("damage" in attack) {
            const buffed = attack.damage.add(this.buff);
            enemy.damage(buffed);
            console.log("Buffed attack", buffed);
            this.buff = new Damage();
        }
        if ("buff" in attack)
            this.buff = attack.buff.add(this.buff);
    }

    loot() {
        if (Math.random() < this.lootChance && this.lootPool.consumables != null) {
            return ["consumables", this.lootPool.consumables[Math.floor(Math.random() * this.lootPool.consumables.length)]];
        }
        if (Math.random() < this.lootChance && this.lootPool.weapons != null) {
            return ["weapons", this.lootPool.weapons[Math.floor(Math.random() * this.lootPool.weapons.length)]];
        }
        if (Math.random() < this.lootChance * 2 && this.lootPool.armor != null) {
            return ["armor", this.lootPool.armor[Math.floor(Math.random() * this.lootPool.armor.length)]];
        }
        if (this.lootPool.keyItems != null) {
            return ["keyItems", this.lootPool.keyItems[Math.floor(Math.random() * this.lootPool.keyItems.length)]]
        }
        return [null, null];
    }

}