// Not used yet but may be useful at some point

export class Event {
    constructor() {}
    async play(game) {}
}

export class NPCEvent extends Event {
    constructor(npc) { 
        super();
        this.npc = npc;
    }
}