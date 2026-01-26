import { Damage } from "./Combatant.js";

export const Consumables = [
    {name: "Greater Healing Flask", damage: new Damage({heal: 65, burnHeal: 15})},
    {name: "Flammable Gas Bladder", damage: new Damage({burning: 22})},
    {name: "Small Health Flask", damage: new Damage({heal: 15})},
    {name: "Tree Sap Liquor", damage: new Damage({mindHeal: 10})},
    {name: "Crushed Bugs", damage: new Damage({heal: 5, mindHeal: 5})}
]

export const Armor = [
    {name: "Lilypad Armor", damage: new Damage({physical: -1, burning: -1})},
    {name: "Barkhide", damage: new Damage({physical: -2, burning: -1})},
    {name: "Wreath of the Penitent", damage: new Damage({physical: -23, burning: 2, ice: -8})},
    {name: "Boreal Chainmail", damage: new Damage({physical: -2, burning: -8, ice: 3})},
    {name: "Tough Hide Armor", damage: new Damage({physical: -15, burning: -5, ice: -2})}
]

export const Weapons = [
    {name: "Icicle", damage: new Damage({physical: 14, ice: 3})},
    {name: "Elven Twinswords", damage: new Damage({physical: 16})},
    {name: "Cursed Shortsword", damage: new Damage({physical: 14, ice: 2, burning: 2})},
    {name: "Behemoth Blade", damage: new Damage({physical: 45})},
    {name: "Greater Flaming Claymore", damage: new Damage({physical: 16, burning: 8})},
    {name: "Greater Icicle", damage: new Damage({physical: 28, ice: 8})}
]