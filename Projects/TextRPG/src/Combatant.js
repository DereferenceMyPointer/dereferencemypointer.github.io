/**
 * Combatant.js
 * 
 * Classes and functions related to combatants in the game.
 * 
 */

const types = {
        physical: "Physical Damage",
        burning: "Burning Affliction",
        ice: "Ice Affliction",
        psychic: "Psychic Damage",
        heal: "Healing",
        mindHeal: "Sanity Restoration",
        iceHeal: "Ice Restoration",
        burnHeal: "Burn Restoration"
    }
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
        for (const [key, _] of Object.entries(types)) {
            if (typeof(this[key]) !== typeof(5)) this[key] = 0;
        }
    }

    // Add two Damage objects together
    add(other) {
        console.log("Adding damage: ", this, other);
        let result = {}
        for (const [key, _] of Object.entries(types)) {
            result[key] = (this[key] || 0) + (other[key] || 0);
        }
        return new Damage(result);
    }

    writeString() {
        let parts = [];
        for (const [key, value] of Object.entries(types))
            parts.push(`${this[key]} ${value}`);
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
            this.iceAffliction -= this.iceTolerance;
            return true;
        }
        return false;
    }

    async combatTick(enemy, game) {
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
        this.currentHP = Math.max(0, this.currentHP - netDamage.physical);
        console.log(`${this.name} current HP after physical damage: `, this.currentHP);
        this.burnAffliction += Math.max(0, netDamage.burning);
        this.iceAffliction += Math.max(0, netDamage.ice);
        this.sanity = Math.max(0, this.sanity - netDamage.psychic);
        this.currentHP = Math.min(this.maxHP, this.currentHP + netDamage.heal);
        this.sanity = Math.min(this.maxHP, this.sanity + netDamage.mindHeal);
        this.burnAffliction = Math.max(0, this.burnAffliction - netDamage.burnHeal);
        this.iceAffliction = Math.max(0, this.iceAffliction - netDamage.iceHeal);
    }

    loot() { return [null, null]; }

    getString() {
        return `${this.name}:\nHP: ${this.currentHP}/${this.maxHP}\nBurn Affliction: ${this.burnAffliction}\nIce Affliction: ${this.iceAffliction}`;
    }

}