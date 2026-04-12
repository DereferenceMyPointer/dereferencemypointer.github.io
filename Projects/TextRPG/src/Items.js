import { Damage } from "./Combatant.js";
import { AstralPlane } from "./Location.js";

export const Consumables = [
    {name: "Greater Healing Flask", damage: new Damage({heal: 65, burnHeal: 15})},
    {name: "Flammable Gas Bladder", damage: new Damage({burning: 14})},
    {name: "Giant Flammable Gas Bladder", damage: new Damage({burning: 26})},
    {name: "Small Health Flask", damage: new Damage({heal: 15})},
    {name: "Tree Sap Liquor", damage: new Damage({mindHeal: 10, iceHeal: 15})},
    {name: "Crushed Bugs", damage: new Damage({heal: 5, mindHeal: 5})},
    {name: "Minor Hurting Potion", damage: new Damage({physical: 22})},
    {name: "Greater Hurting Potion", damage: new Damage({physical: 76})},
]

export const LowTierConsumables = [
    {name: "Flammable Gas Bladder", damage: new Damage({burning: 22})},
    {name: "Small Health Flask", damage: new Damage({heal: 15})},
    {name: "Tree Sap Liquor", damage: new Damage({mindHeal: 10, iceHeal: 15})},
    {name: "Crushed Bugs", damage: new Damage({heal: 5, mindHeal: 5})}
]

export const HighTierConsumables = [
    {name: "Greater Healing Flask", damage: new Damage({heal: 65, burnHeal: 15})},
    {name: "Greater Hurting Potion", damage: new Damage({physical: 76})},
    {name: "Giant Flammable Gas Bladder", damage: new Damage({burning: 26})},
]

export const Armor = [
    {name: "Lilypad Armor", damage: new Damage({physical: -1, burning: -1})},
    {name: "Barkhide", damage: new Damage({physical: -2, burning: -1})},
    {name: "Woven Grass Mail", damage: new Damage({physical: -2, ice: -1})},
    {name: "Wreath of the Penitent", damage: new Damage({physical: -23, burning: 2, ice: -8})},
    {name: "Boreal Chainmail", damage: new Damage({physical: -18, burning: -8, psychic: -4, ice: 3})},
    {name: "Tough Hide Armor", damage: new Damage({physical: -15, burning: -5, ice: -2})}
]

export const LowTierArmor = [
    {name: "Lilypad Armor", damage: new Damage({physical: -1, burning: -2})},
    {name: "Barkhide", damage: new Damage({physical: -2, burning: -1, psychic: -1})},
    {name: "Woven Grass Mail", damage: new Damage({physical: -2, ice: -1})},
]

export const HighTierArmor = [
    {name: "Wreath of the Penitent", damage: new Damage({physical: -23, burning: 2, ice: -8})},
    {name: "Boreal Chainmail", damage: new Damage({physical: -18, burning: -8, psychic: -4, ice: 3})},
    {name: "Tough Hide Armor", damage: new Damage({physical: -15, burning: -5, ice: -2})}
]

export const Weapons = [
    {name: "Icicle", damage: new Damage({physical: 14, ice: 3})},
    {name: "Elven Twinswords", damage: new Damage({physical: 16})},
    {name: "Iceflame Shortsword", damage: new Damage({physical: 14, ice: 2, burning: 2})},
    {name: "Behemoth Blade", damage: new Damage({physical: 45})},
    {name: "Greater Flaming Claymore", damage: new Damage({physical: 16, burning: 8})},
    {name: "Greater Icicle", damage: new Damage({physical: 28, ice: 8})},
    {name: "Frostburn Dragon Claw", damage: new Damage({physical: 46, ice: 6, burning: 6, psychic: 6})},
]

export const LowTierWeapons = [
    {name: "Icicle", damage: new Damage({physical: 14, ice: 3})},
    {name: "Elven Twinswords", damage: new Damage({physical: 16, psychic: 6})},
    {name: "Cursed Shortsword", damage: new Damage({physical: 14, ice: 2, burning: 2})},
]

export const HighTierWeapons = [
    {name: "Behemoth Blade", damage: new Damage({physical: 45})},
    {name: "Greater Flaming Claymore", damage: new Damage({physical: 16, burning: 8})},
    {name: "Greater Icicle", damage: new Damage({physical: 28, ice: 8})}
]

export const BossWeapons = {
    Erythel: {name: "Frostburn Dragon Claw", damage: new Damage({physical: 46, ice: 6, burning: 6, psychic: 6})},
}

export const KeyItems = {
    CloudKey: {name: 'Cloud Key', actOnGame: async function(game) { 
            game.eventGenerator = new AstralPlane(game.eventGenerator);
            await game.narrator.narrate(["You feel your surroundings shifting around you...", ""]);
        }, description: ""
    },
    DeathKey: {name: 'Death Key', actOnGame: async function(game) {
        game.narrator.clear();
        await game.narrator.narrate([
            "You feel strangely drawn to this key...",
            "It slots perfectly into your wrist. The tip vanishes beneath your skin, but you feel nothing.",
            "You turn the key.",
            "A faint tingling feeling pricks at your fingers...",
            "Thee feeling starts to evolve. It spreads down your arms and through your legs.",
            "It's almost euphoric...",
            "",
            "Your eyelids grow heavy.",
            "By the time they've shut, you've lost all feeling in your body.",
            "...",
            ""
        ])
        game.player.currentHP = 0;
    }}
}