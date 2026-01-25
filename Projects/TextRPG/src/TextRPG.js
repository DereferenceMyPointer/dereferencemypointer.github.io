import { Narrator } from "./Narrator.js";
import { Game } from "./Game.js";

(function() {
    /**
     * TextRPG
     * A simple text-based RPG game engine.
     */
    
    const worldname = "Aleria";

    async function main(narrator) {
        const game = new Game(narrator, worldname);
        await game.start();
        console.log("Game started.");
        $('submit-button').addEventListener('click', async function(event) {
            event.preventDefault();
            const inputField = $('input-field');
            const playerInput = inputField.value.trim().toLowerCase();
            inputField.value = '';
            await game.takeInput(playerInput);
        });
        document.addEventListener('keydown', async function(event) {
            if (event.key === 'ArrowUp') {
                event.preventDefault();
                await game.takeInput('north');
            } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                await game.takeInput('south');
            } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                await game.takeInput('west');
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                await game.takeInput('east');
            }
            if (event.key !== 'Enter') return;
            event.preventDefault();
            const inputField = $('input-field');
            const playerInput = inputField.value.trim().toLowerCase();
            inputField.value = '';
            await game.takeInput(playerInput);
        });
    }

    document.addEventListener("DOMContentLoaded", async function() {
        const outputElement = $('console');
        const narrator = new Narrator(outputElement, 5, 400);

        await main(narrator);

    });

})();


/**
 *                  HELPER FUNCTIONS
 */

function $(selector) {
    return document.getElementById(selector);
}
function qs(selector) {
    return document.querySelector(selector);
}
function qsa(selector) {
    return document.querySelectorAll(selector);
}