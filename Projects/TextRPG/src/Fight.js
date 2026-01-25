
export class Fight {
    constructor(player, enemy, game) {
        this.player = player;
        this.enemy = enemy;
        this.game = game;
    }

    async start(ambush=false) {
        const enemyTurns = Math.max(Math.floor((this.enemy.agility - this.player.agility) / 2), 0) + 1;
        const playerTurns = Math.max(Math.floor((this.player.agility - this.enemy.agility) / 2), 0) + 1;
        await this.player.combatTick(this.game);
        if (this.player.currentHP <= 0) {
            await this.game.narrator.narrate([`${this.enemy.name} killed ${this.player.name}!`]);
            return false;
        }
        for (let i = 0; i < playerTurns; i++)
            await this.player.takeCombatTurn(this.enemy, this.game);
        if (this.enemy.currentHP <= 0) {
            await this.game.narrator.narrate([`${this.player.name} killed ${this.enemy.name}!`]);
            return true;
        }
        await this.enemy.combatTick(this.game);
        if (this.enemy.currentHP <= 0) {
            await this.game.narrator.narrate([`${this.player.name} killed ${this.enemy.name}!`]);
            return true;
        }
        for (let i = 0; i < enemyTurns; i++)
            await this.enemy.takeCombatTurn(this.player, this.game);
        return await this.start();
    }

    async _execute_phase() {

    }
}