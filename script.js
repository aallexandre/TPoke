const typeOneSelect = document.querySelector("#type-one");
const typeTwoSelect = document.querySelector("#type-two");
const calculateButton = document.querySelector("#calculate-button");
const resultArea = document.querySelector("#result");

const typeNames = {
  normal: "Normal",
  fire: "Fogo",
  water: "Agua",
  grass: "Grama",
  electric: "Eletrico",
  ice: "Gelo",
  fighting: "Lutador",
  poison: "Venenoso",
  ground: "Terra",
  flying: "Voador",
  psychic: "Psiquico",
  bug: "Inseto",
  rock: "Pedra",
  ghost: "Fantasma",
  dragon: "Dragao",
  dark: "Sombrio",
  steel: "Aco",
  fairy: "Fada"
};

const allTypes = Object.keys(typeNames);

const effectiveness = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 2,
    bug: 2,
    rock: 0.5,
    dragon: 0.5,
    steel: 2
  },
  water: {
    fire: 2,
    water: 0.5,
    grass: 0.5,
    ground: 2,
    rock: 2,
    dragon: 0.5
  },
  grass: {
    fire: 0.5,
    water: 2,
    grass: 0.5,
    poison: 0.5,
    ground: 2,
    flying: 0.5,
    bug: 0.5,
    rock: 2,
    dragon: 0.5,
    steel: 0.5
  },
  electric: {
    water: 2,
    grass: 0.5,
    electric: 0.5,
    ground: 0,
    flying: 2,
    dragon: 0.5
  },
  ice: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 0.5,
    ground: 2,
    flying: 2,
    dragon: 2,
    steel: 0.5
  },
  fighting: {
    normal: 2,
    ice: 2,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    rock: 2,
    ghost: 0,
    dark: 2,
    steel: 2,
    fairy: 0.5
  },
  poison: {
    grass: 2,
    poison: 0.5,
    ground: 0.5,
    rock: 0.5,
    ghost: 0.5,
    steel: 0,
    fairy: 2
  },
  ground: {
    fire: 2,
    grass: 0.5,
    electric: 2,
    poison: 2,
    flying: 0,
    bug: 0.5,
    rock: 2,
    steel: 2
  },
  flying: {
    grass: 2,
    electric: 0.5,
    fighting: 2,
    bug: 2,
    rock: 0.5,
    steel: 0.5
  },
  psychic: {
    fighting: 2,
    poison: 2,
    psychic: 0.5,
    dark: 0,
    steel: 0.5
  },
  bug: {
    fire: 0.5,
    grass: 2,
    fighting: 0.5,
    poison: 0.5,
    flying: 0.5,
    psychic: 2,
    ghost: 0.5,
    dark: 2,
    steel: 0.5,
    fairy: 0.5
  },
  rock: {
    fire: 2,
    ice: 2,
    fighting: 0.5,
    ground: 0.5,
    flying: 2,
    bug: 2,
    steel: 0.5
  },
  ghost: {
    normal: 0,
    psychic: 2,
    ghost: 2,
    dark: 0.5
  },
  dragon: {
    dragon: 2,
    steel: 0.5,
    fairy: 0
  },
  dark: {
    fighting: 0.5,
    psychic: 2,
    ghost: 2,
    dark: 0.5,
    fairy: 0.5
  },
  steel: {
    fire: 0.5,
    water: 0.5,
    electric: 0.5,
    ice: 2,
    rock: 2,
    steel: 0.5,
    fairy: 2
  },
  fairy: {
    fire: 0.5,
    fighting: 2,
    poison: 0.5,
    dragon: 2,
    dark: 2,
    steel: 0.5
  }
};

const resultGroups = [
  { title: "Fraquezas 4x", value: 4 },
  { title: "Fraquezas 2x", value: 2 },
  { title: "Dano normal 1x", value: 1 },
  { title: "Resistencias 0.5x", value: 0.5 },
  { title: "Resistencias 0.25x", value: 0.25 },
  { title: "Imunidades 0x", value: 0 }
];

function getAttackMultiplier(attackType, defenseType) {
  return effectiveness[attackType][defenseType] ?? 1;
}

function calculateWeaknesses(defenseTypes) {
  return allTypes.reduce((result, attackType) => {
    const multiplier = defenseTypes.reduce((total, defenseType) => {
      return total * getAttackMultiplier(attackType, defenseType);
    }, 1);

    result[multiplier].push(typeNames[attackType]);
    return result;
  }, {
    4: [],
    2: [],
    1: [],
    0.5: [],
    0.25: [],
    0: []
  });
}

function renderResult(groups) {
  resultArea.innerHTML = "";

  resultGroups.forEach((group) => {
    const card = document.createElement("article");
    card.className = "result-card";

    const title = document.createElement("h2");
    title.textContent = group.title;

    const list = document.createElement("p");
    list.textContent = groups[group.value].length
      ? groups[group.value].join(", ")
      : "Nenhum";

    card.append(title, list);
    resultArea.append(card);
  });
}

calculateButton.addEventListener("click", () => {
  const typeOne = typeOneSelect.value;
  const typeTwo = typeTwoSelect.value;

  if (!typeOne) {
    resultArea.textContent = "Escolha pelo menos o Tipo 1.";
    return;
  }

  if (typeOne === typeTwo) {
    resultArea.textContent = "Escolha tipos diferentes ou deixe o Tipo 2 como Nenhum.";
    return;
  }

  const defenseTypes = typeTwo ? [typeOne, typeTwo] : [typeOne];
  const groups = calculateWeaknesses(defenseTypes);

  renderResult(groups);
});
