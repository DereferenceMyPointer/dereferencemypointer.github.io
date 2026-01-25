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
        super(name, 30, new Damage(), 20, 1, 5);
        this.primaryWeapon = {"name": "Flaming Claymore", "damage": new Damage({physical: 10, burning: 5})};
        this.armor = {"name": "Plain Clothing", "damage": new Damage()};
        this.inventory = {
            "weapons": [
                this.primaryWeapon,
                {"name": "Icicle", "damage": new Damage({physical: 13, ice: 7})}
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
            if (itemType === "consumables") {
                confirmed = await this.confirmItem(this.inventory[itemType][index], game, "Use");
            } else if (itemType === "keyItems") {
                confirmed = await this.confirmItem(this.inventory[itemType][index], game, "Use", hideStats=true);
            } else {
                confirmed = await this.confirmItem(this.inventory[itemType][index], game, "Equip");
            }
            console.log("Item confirmed: ", confirmed, this.inventory[itemType][index]);
            if (confirmed) return this.inventory[itemType][index];
            else return null;
        }
        return await this.getFromInventory(itemType, game);
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
            const input = await game.awaitInput();
            switch(input) {
                case '1':
                    game.narrator.clear();
                    await game.narrator.narrate([`${this.name} attacks with ${this.primaryWeapon.name}!`]);
                    enemy.damage(this.primaryWeapon.damage);
                    return true;
                case '2':
                    let item = await this.getFromInventory("consumables", game);
                    console.log("Selected item: ", item);
                    if (item !== null) {
                        game.narrator.clear();
                        game.narrator.narrateInstant([`Choose a target:\n1: ${this.name}\n2: ${enemy.name}`]);
                        let targetInput = await game.awaitInput();
                        switch(targetInput) {
                            case '1':
                                game.narrator.clear();
                                await this.damage(item.damage);
                                await game.narrator.narrate([`${this.name} uses ${item.name} on themselves!`]);
                                return true;
                            case '2':
                                game.narrator.clear();
                                await enemy.damage(item.damage);
                                await game.narrator.narrate([`${this.name} uses ${item.name} on ${enemy.name}!`]);
                                return true;
                            default:
                                break;
                        }
                    }
            }
            game.narrator.clear();
        }
    }
}