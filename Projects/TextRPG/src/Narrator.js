/**
 * Narrator.js
 * 
 * Interface for narrating text to the player.
 */


export class Narrator {
    // element: DOM element to output text to
    // typespeed: delay between characters (ms)
    // tempo: delay between lines (ms)
    constructor(element, typespeed = 10, tempo=800) {
        this.element = element;
        this.typespeed = typespeed;
        this.currentTypespeed = typespeed;
        this.tempo = tempo;
        this.currentTempo = tempo;
    }

    // Narrate an array of lines
    // lines: array of strings
    async narrate(lines) {
        for (const line of lines) {
            await new Promise(resolve => setTimeout(resolve, this.currentTempo));
            for (const character of line) {
                this.element.textContent += character;
                await new Promise(resolve => setTimeout(resolve, this.currentTypespeed));
            }
            this.element.textContent += '\n';
        }
    }

    narrateInstant(lines) {
        for (const line of lines) {
            this.element.textContent += line + '\n';
        }
    }

    async buffer() {
        await new Promise(resolve => setTimeout(resolve, this.currentTempo));
    }

    speedUp() {
        this.currentTypespeed = 0;
        this.currentTempo = 50;
    }

    clear() {
        this.element.textContent = '';
    }

}