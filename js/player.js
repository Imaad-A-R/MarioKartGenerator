
export class Player{
    constructor(){
        this.character = null;
        this.kart = null;
        this.locks = {character: false, kart: false}
    }

    toggleLock(part) {
        this.locks[part] = !this.locks[part];
        return this.locks[part];
    }

    setCharacter(randomChar){
        if (!this.locks.character){
            this.character = randomChar;
        }
        return this.character;
    }

    setKart(randomKart){
        if (!this.locks.kart){
            this.kart = randomKart;
        }
        return this.kart;
    }
}