import { characters } from "../data/characters.js";
import { karts } from "../data/karts.js";
import { characterImages, kartImages } from "../data/images.js";
import { Player } from "./player.js";

const playerCount = 4;

const players = Array.from({ length: playerCount }, () => new Player());

function getRandomItem(obj) {
  const keys = Object.keys(obj);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return randomKey;
}

function setupCombosUI() {
  const container = document.getElementById("combos");
  container.innerHTML = "";

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
    `;

    container.appendChild(comboDiv);
  }

  for (let i = 0; i < playerCount; i++) {
    document.getElementById(`lock-character-${i}`).addEventListener("click", () => handleLockButtonClick(i, "character"));
    document.getElementById(`lock-kart-${i}`).addEventListener("click", () => handleLockButtonClick(i, "kart"));
  }
}

function generateCombo() {
  for (let i = 0; i < playerCount; i++) {
    const characterName = players[i].setCharacter(getRandomItem(characters));
    const kartName = players[i].setKart(getRandomItem(karts));

    const charStats = characters[characterName];
    const kartStats = karts[kartName];

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

    document.getElementById(`character-${i}`).innerText = `Character: ${characterName}`;
    document.getElementById(`kart-${i}`).innerText = `Kart: ${kartName}`;
    document.getElementById(`character-img-${i}`).src = characterImages[characterName];
    document.getElementById(`kart-img-${i}`).src = kartImages[kartName];

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

function handleLockButtonClick(index, part) {
  const isLocked = players[index].toggleLock(part); // update lock and return new state
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


document.getElementById("generate").addEventListener("click", generateCombo);
setupCombosUI();