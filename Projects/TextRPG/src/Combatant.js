/**
 * Combatant.js
 * 
 * Classes and functions related to combatants in the game.
 * 
 */


export class Damage {
    constructor( {physical = 0, burning = 0, ice = 0, psychic = 0, heal = 0, mindHeal = 0, iceHeal = 0, burnHeal = 0} = {} ) {
        this.physical = physical;
        this.burning = burning;
        this.ice = ice;
        this.psychic = psychic;
        this.heal = heal;
        this.mindHeal = mindHeal;
        this.iceHeal = iceHeal;
        this.burnHeal = burnHeal;
    }

    // Add two Damage objects together
    add(other) {
        console.log("Adding damage: ", this, other);
        return new Damage(
            (this.physical || 0) + (other.physical || 0),
            (this.burning || 0) + (other.burning || 0),
            (this.ice || 0) + (other.ice || 0),
            (this.psychic || 0) + (other.psychic || 0),
            (this.heal || 0) + (other.heal || 0),
            (this.mindHeal || 0) + (other.mindHeal || 0),
            (this.iceHeal || 0) + (other.iceHeal || 0),
            (this.burnHeal || 0) + (other.burnHeal || 0)
        );
    }

    writeString() {
        let parts = [];
        if (this.physical) parts.push(`${this.physical} Physical Damage`);
        if (this.psychic) parts.push(`${this.psychic} Psychic Damage`);
        if (this.burning) parts.push(`${this.burning} Burning Affliction`);
        if (this.ice) parts.push(`${this.ice} Ice Affliction`);
        if (this.heal) parts.push(`${this.heal} Healing`);
        if (this.mindHeal) parts.push(`${this.mindHeal} Sanity Restoration`);
        if (this.iceHeal) parts.push(`${this.iceHeal} Ice Restoration`);
        if (this.burnHeal) parts.push(`${this.burnHeal} Burn Restoration`);
        return parts.join("\n");
    }
}

export class Combatant {
    constructor(name, maxHP, resistances = new Damage(), sanity = 10, agility = 1, iceTolerance = 5) {
        this.name = name;
        this.maxHP = maxHP;
        this.currentHP = maxHP;
        this.resistances = resistances;
        this.burnAffliction = 0;
        this.sanity = sanity;
        this.agility = agility;
        this.iceTolerance = iceTolerance;
        this.iceAffliction = 0;
    }

    // Base combat turn functionality
    async takeCombatTurn(enemy, game) {
        if (this.iceAffliction >= this.iceTolerance) {
            await game.narrator.narrate([`${this.name} is completely frozen! Its turn was skipped!`]);
            return true;
        }
        return false;
    }

    async combatTick(game) {
        if (this.burnAffliction > 0) {
            const burnDamage = Math.min(this.burnAffliction, this.currentHP);
            this.currentHP -= burnDamage;
            await game.narrator.narrate([`${this.name} is on fire! It takes ${burnDamage} damage from its affliction!`]);
            this.burnAffliction = Math.max(0, this.burnAffliction - 1); 
        }
    }

    async damage(damage) {
        console.log(`${this.name} is taking damage: `, damage);
        console.log(`${this.name} resistances: `, this.resistances);
        console.log(`${this.name} current HP before damage: `, this.currentHP);
        const netDamage = damage.add(this.resistances);
        console.log(`${this.name} damage after resistances: `, netDamage);
        console.log(`${this.name} physical damage taken: `, netDamage.physical);
        this.currentHP = Math.max(0, this.currentHP - damage.physical);
        console.log(`${this.name} current HP after physical damage: `, this.currentHP);
        this.burnAffliction += Math.max(0, damage.burning);
        this.iceAffliction += Math.max(0, damage.ice);
        this.sanity = Math.max(0, this.sanity - damage.psychic);
    }

    getString() {
        return `${this.name}:\nHP: ${this.currentHP}/${this.maxHP}\nSanity: ${this.sanity}\nBurn Affliction: ${this.burnAffliction}\nIce Affliction: ${this.iceAffliction}`;
    }

}

const basicEnemies = [
    { "name": "Stick-shaped Insect", "maxHP": 20 , "weapon": {"name": "Chirp", "damage": new Damage({physical: 5})} },
    { "name": "Pygmy Elf", "maxHP": 15, "weapon": {"name": "Vicious Scratch", "damage": new Damage({physical: 8})} },
    { "name": "Firefly Swarm", "maxHP": 10, "weapon": {"name": "Burning Aura", "damage": new Damage({burning: 4})} },
    { "name": "Anteater", "maxHP": 25, "weapon": {"name": "Claws", "damage": new Damage({physical: 10})} },
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
        const skipped = await super.takeCombatTurn(enemy, game);
        if (skipped) return true;
        await game.narrator.narrate([`${this.name} attacks with its ${this.weapon.name}!`]);
        await enemy.damage(this.weapon.damage);
        return true;
    }
}