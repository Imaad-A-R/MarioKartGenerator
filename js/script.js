//imports
import { characters } from "../data/characters.js";
import { karts } from "../data/karts.js";
import { characterImages, kartImages } from "../data/images.js";
import { Player } from "./player.js";

//declare player count and create player objects
const playerCount = 4;

const players = Array.from({ length: playerCount }, () => new Player());

//generate random character or kart
function getRandomItem(obj) {
  const keys = Object.keys(obj);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return randomKey;
}

//function that creates and inserts player combo container HTML
function setupCombosUI() {
  const container = document.getElementById("combos");
  container.innerHTML = "";

  //loop creates 4 player containers and inserts the html
  for (let i = 0; i < playerCount; i++) {
    const comboDiv = document.createElement("div");
    comboDiv.className = "combo";
    comboDiv.dataset.index = i;

    comboDiv.innerHTML = `
      <h2>Player ${i + 1}</h2>
      <p id="character-${i}">Character: </p>
      <button id="lock-character-${i}" class="lock-button">🔓 Lock Character</button>
      <p id="kart-${i}">Kart: </p>
      <button id="lock-kart-${i}" class="lock-button">🔓 Lock Kart</button>
      <div class="image-row">
        <img id="character-img-${i}" class="combo-image" src="">
        <img id="kart-img-${i}" class="combo-image" src="">
      </div>
      <div id="stats-${i}" class="stats"></div>
      <button id="single-randomizer-${i}" class="randomize-button">Randomize Combo</button>
    `;

    container.appendChild(comboDiv);
  }

  //create lock button and individual randomizer button event listeners
  for (let i = 0; i < playerCount; i++) {
    document.getElementById(`lock-character-${i}`).addEventListener("click", () => handleLockButtonClick(i, "character"));
    document.getElementById(`lock-kart-${i}`).addEventListener("click", () => handleLockButtonClick(i, "kart"));
    document.getElementById(`single-randomizer-${i}`).addEventListener("click", () => generateCombo(i));
  }
}

//function to generate random combos
function generateCombo(comboNumber=null) {

  //set start and end to randomize all combos if no parameters, or randomize the given singular one
  let start, end;
  if (comboNumber===null){
    start=0;
    end = playerCount-1;
  }
  else{
    start = comboNumber;
    end =comboNumber;
  }
  
  for (let i = start; i <= end; i++) {
    //create character and kart name variables
    //randomize the kart and character and then pass them to the objects to be updated
    const characterName = players[i].setCharacter(getRandomItem(characters));
    const kartName = players[i].setKart(getRandomItem(karts));

    const charStats = characters[characterName];
    const kartStats = karts[kartName];

    //calculate stats for combo
    const finalStats = {
      roadSpeed: charStats.roadSpeed + kartStats.roadSpeed,
      terrainSpeed: charStats.terrainSpeed + kartStats.terrainSpeed,
      liquidSpeed: charStats.liquidSpeed + kartStats.liquidSpeed,
      acceleration: charStats.acceleration + kartStats.acceleration,
      miniTurbo: charStats.miniTurbo + kartStats.miniTurbo,
      weight: charStats.weight + kartStats.weight,
      coins: charStats.coins + kartStats.coins,
      roadHandling: charStats.roadHandling + kartStats.roadHandling,
      terrainHandling: charStats.terrainHandling + kartStats.terrainHandling,
      liquidHandling: charStats.liquidHandling + kartStats.liquidHandling
    };

    //insert character and kart names and images
    document.getElementById(`character-${i}`).innerText = `Character: ${characterName}`;
    document.getElementById(`kart-${i}`).innerText = `Kart: ${kartName}`;
    document.getElementById(`character-img-${i}`).src = characterImages[characterName];
    document.getElementById(`kart-img-${i}`).src = kartImages[kartName];

    //insert stats HTML
    document.getElementById(`stats-${i}`).innerHTML = `

      ${statRow("<strong>Road Speed</strong>", finalStats.roadSpeed)}
      ${statRow("<strong>Terrain Speed</strong>", finalStats.terrainSpeed)}
      ${statRow("<strong>Liquid Speed</strong>", finalStats.liquidSpeed)}
      ${statRow("<strong>Acceleration & Mini Turbo</strong>", finalStats.acceleration)}
      ${statRow("<strong>Weight & Coins</strong>", finalStats.weight)}
      ${statRow("<strong>Road Handling</strong>", finalStats.roadHandling)}
      ${statRow("<strong>Terrain Handling</strong>", finalStats.terrainHandling)}
      ${statRow("<strong>Liquid Handling</strong>", finalStats.liquidHandling)}
    `;
  }
}

//function to handle clicks for lock button, updating the states for the respective player, and changing the display
function handleLockButtonClick(index, part) {
  //update lock and return new state
  const isLocked = players[index].toggleLock(part);
  const button = document.getElementById(`lock-${part}-${index}`);

  if (isLocked) {
  button.textContent = `🔒 Unlock ${capitalize(part)}`;
  button.classList.add("locked");
  } 
  else {
  button.textContent = `🔓 Lock ${capitalize(part)}`;
  button.classList.remove("locked");
  }
}


function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

//FUNCTION FOR PROGRESS BAR
//has the HTML for the simple progress bar, then when needed it calls this function to generate it
function bar(value, max = 17) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return `
    <div class="bar-row">
      <span class="bar-value">${value}</span>
      <div class="progress">
        <div class="progress-bar" style="width:${pct}%"></div>
      </div>
    </div>
  `;
}

function statRow(label, value, max = 17) {
  return `
    <div class="stat-block">
      <div class="stat-label">${label}:</div>
      <div class="bar-row">
        <span class="bar-value">${value}</span>
        <div class="progress">
          <div class="progress-bar" style="width:${(value/max)*100}%"></div>
        </div>
      </div>
    </div>
  `;
}


document.getElementById("generate").addEventListener("click", () => generateCombo());
setupCombosUI();