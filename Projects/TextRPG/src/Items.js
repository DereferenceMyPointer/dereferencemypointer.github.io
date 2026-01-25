import { Damage } from "./Combatant.js";

export const Consumables = [
    {name: "Greater Healing Flask", damage: new Damage({heal: 65, burnHeal: 15})},
    {name: "Flammable Gas Bladder", damage: new Damage({burning: 22})}
]

export const Armor = [
    {name: "Lilypad Armor", damage: new Damage({physical: -1, burning: -1})},
    {name: "Tough Hide Armor", damage: new Damage({physical: -15, burning: -5, ice: -2})}
]

export const Weapons = [
    {name: "Icicle", damage: new Damage({physical: 14, ice: 3})},
    {name: "Greater Icicle", damage: new Damage({physical: 28, ice: 8})}
]