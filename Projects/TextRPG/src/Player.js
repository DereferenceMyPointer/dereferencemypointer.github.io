import { Combatant } from "./Combatant.js";
import { Damage } from "./Combatant.js";

/**
 * Player.js
 * 
 * Represents the player character and their stats/inventory.
 * 
 */

export class Player extends Combatant {
    constructor(name) {
        super(name, 30, new Damage(), 10, 1, 5);
        this.primaryWeapon = {"name": "Flaming Claymore", "damage": new Damage({physical: 8, burning: 4})};
        this.armor = {"name": "Plain Clothing", "damage": new Damage()};
        this.resistances = this.armor.damage;
        this.inventory = {
            "weapons": [
                this.primaryWeapon
            ],
            "armor": [
                this.armor
            ],
            "consumables": [
                {"name": "Small Health Potion", "damage": new Damage({heal: 15})},
                {"name": "Small Mind Potion", "damage": new Damage({mindHeal: 10})}
            ],
            "keyItems": []
        };
    }

    async useInventory(game) {
        game.narrator.clear();
        game.narrator.narrateInstant([this.getString()]);
        game.narrator.narrateInstant(["Inventory:\n1: Weapons\n2: Armor\n3: Consumables\n4: Key Items\n0: Cancel"]);
        let s = await game.awaitInput();
        let item = null;
        switch(s) {
            case '1':
                item = await this.getFromInventory("weapons", game);
                if (item) this.primaryWeapon = item;
                break;
            case '2':
                item = await this.getFromInventory("armor", game);
                if (item) this.armor = item;
                this.resistances = this.armor.damage;
                break;
            case '3':
                item = await this.getFromInventory("consumables", game);
                if (item) this.damage(item.damage);
                break;
            case '4':
                item = await this.getFromInventory("keyItems", game);
                break;
            case '0':
                game.narrator.clear();
                return false;
            default:
                break;
        }
        return true;
    }

    async getFromInventory(itemType, game) {
        console.log(game);
        if (this.inventory[itemType].length === 0) return null;
        game.narrator.clear();
        game.narrator.narrateInstant(["Carried " + itemType + ":"]);
        for (let i = 0; i < this.inventory[itemType].length; i++) {
            game.narrator.narrateInstant([`${i+1}: ${this.inventory[itemType][i].name}`]);
        }
        game.narrator.narrateInstant(["0: Cancel"]);
        let s = await game.awaitInput();
        let index = parseInt(s) - 1;
        if (index === -1) return null;
        if (index >= 0 && index < this.inventory[itemType].length) {
            let confirmed = false;
            let item = this.inventory[itemType][index];
            if (itemType === "consumables") {
                confirmed = await this.confirmItem(item, game, "Use");
                if (confirmed)
                    this.removeIndex(index, this.inventory[itemType]);
            } else if (itemType === "keyItems") {
                confirmed = await this.confirmItem(item, game, "Use", hideStats=true);
            } else {
                confirmed = await this.confirmItem(item, game, "Equip");
            }
            if (!confirmed) item = null;
            console.log("Item confirmed: ", confirmed, this.inventory[itemType][index]);
            return item;
        }
        return await this.getFromInventory(itemType, game);
    }

    removeIndex(index, list) {
        for (let i = index; i < list.length - 1; i++) {
            list[i] = list[i + 1];
        }
        list.pop();
    }

    async confirmItem(item, game, message="", hideStats=false) {
        game.narrator.clear();
        if (!hideStats) {
            game.narrator.narrateInstant([`${item.name}\nStats:\n${item.damage.writeString()}`]);
        }
        game.narrator.narrateInstant([`${message} ${item.name}?\n1: Yes\n0: Cancel`]);
        let s = await game.awaitInput();
        console.log("Confirm input: ", s);
        s = parseInt(s);
        switch(s) {
            case 1:
                return true;
            case 0:
                return false;
            default:
                return await this.confirmItem(item, game, message, hideStats);
        }
    }

    async takeCombatTurn(enemy, game) {
        const skipped = await super.takeCombatTurn(enemy, game);
        if (skipped) return true;
        while(true) {
            await game.narrator.narrate([this.getString()]);
            await game.narrator.narrate([enemy.getString()]);
            await game.narrator.narrate([`${this.name}'s turn!\n1: Attack!\n2: Use item`]);
            console.log(2);
            let input = await game.awaitInput();
            console.log(3)
            input = parseInt(input)
            switch(input) {
                case 1:
                    game.narrator.clear();
                    await game.narrator.narrate([`${this.name} attacks with ${this.primaryWeapon.name}!`]);
                    enemy.damage(this.primaryWeapon.damage);
                    return true;
                case 2:
                    let item = await this.getFromInventory("consumables", game);
                    console.log("Selected item: ", item);
                    if (item !== null) {
                        game.narrator.clear();
                        game.narrator.narrateInstant([`Choose a target:\n1: ${this.name}\n2: ${enemy.name}`]);
                        let targetInput = await game.awaitInput();
                        targetInput = parseInt(targetInput);
                        switch(targetInput) {
                            case 1:
                                game.narrator.clear();
                                await this.damage(item.damage);
                                await game.narrator.narrate([`${this.name} uses ${item.name} on themselves!`]);
                                return true;
                            case 2:
                                game.narrator.clear();
                                await enemy.damage(item.damage);
                                await game.narrator.narrate([`${this.name} uses ${item.name} on ${enemy.name}!`]);
                                return true;
                            default:
                                break;
                        }
                    }
                default: break;
            }
            game.narrator.clear();
        }
    }

    getString() {
        let sanityString = `\n`;
        if (this.sanity <= 5) {
            sanityString += `Your suffering feels endless...`;
        } else if (this.sanity <= 15) {
            sanityString += `Your mental health is precariously in the balance.`;
        } else if (this.sanity <= 30) {
            sanityString += `You feel reasonably well.`;
        } else if (this.sanity <= 50) {
            sanityString += `You have your wits well about you.`;
        } else {
            sanityString += `You feel excellent.`;
        }
        console.log(super.getString() + sanityString);
        return super.getString() + sanityString;
    }

}