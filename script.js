const typeOneSelect = document.querySelector("#type-one");
const typeTwoSelect = document.querySelector("#type-two");
const calculateButton = document.querySelector("#calculate-button");
const searchInput = document.querySelector("#pokemon-search");
const searchButton = document.querySelector("#search-button");
const suggestionsArea = document.querySelector("#pokemon-suggestions");
const resultArea = document.querySelector("#result");

let pokemonList = [];

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
    resultArea.append(createResultCard(group.title, groups[group.value]));
  });
}

function createResultCard(titleText, items) {
  const card = document.createElement("article");
  card.className = "result-card";

  const title = document.createElement("h2");
  title.textContent = titleText;

  const list = document.createElement("p");
  list.textContent = items.length ? items.join(", ") : "Nenhum";

  card.append(title, list);
  return card;
}

function formatApiName(name) {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatDexNumber(id) {
  return `#${String(id).padStart(3, "0")}`;
}

function normalizePokemonName(name) {
  return name.trim().toLowerCase().replace(/\s+/g, "-");
}

function normalizePokemonSearchTerm(value) {
  const searchText = value.trim().toLowerCase();
  const numericMatch = searchText.match(/^#?0*(\d+)$/);

  if (numericMatch) {
    return numericMatch[1];
  }

  return searchText.replace(/\s+/g, "-");
}

function getPokemonIdFromUrl(url) {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  return match ? Number(match[1]) : null;
}

async function loadPokemonList() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=2000");

    if (!response.ok) {
      return;
    }

    const data = await response.json();
    pokemonList = data.results.map((pokemon) => ({
      name: pokemon.name,
      id: getPokemonIdFromUrl(pokemon.url)
    }));
  } catch (error) {
    pokemonList = [];
  }
}

function hideSuggestions() {
  suggestionsArea.innerHTML = "";
  suggestionsArea.classList.remove("is-visible");
}

function renderSuggestions() {
  const rawSearchText = searchInput.value.trim().toLowerCase();
  const searchText = normalizePokemonName(rawSearchText);

  if (!rawSearchText) {
    hideSuggestions();
    return;
  }

  const numericMatch = rawSearchText.match(/^#?0*(\d*)$/);
  const numericSearchText = numericMatch ? numericMatch[1] : "";
  const suggestions = pokemonList
    .filter((pokemon) => {
      if (numericSearchText) {
        return pokemon.id && String(pokemon.id).startsWith(numericSearchText);
      }

      return pokemon.name.startsWith(searchText);
    })
    .slice(0, 8);

  suggestionsArea.innerHTML = "";

  if (!suggestions.length) {
    hideSuggestions();
    return;
  }

  suggestions.forEach((pokemonName) => {
    const button = document.createElement("button");
    button.className = "suggestion-button";
    button.type = "button";
    button.setAttribute("role", "option");

    const text = document.createElement("span");
    text.className = "suggestion-text";

    const name = document.createElement("strong");
    name.className = "suggestion-name";
    name.textContent = formatApiName(pokemonName.name);

    text.append(name);

    if (pokemonName.id) {
      const number = document.createElement("span");
      number.className = "suggestion-number";
      number.textContent = formatDexNumber(pokemonName.id);
      text.append(number);

      const image = document.createElement("img");
      image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonName.id}.png`;
      image.alt = "";
      image.loading = "lazy";
      button.append(text, image);
    } else {
      button.append(text);
    }

    button.addEventListener("click", () => {
      searchInput.value = pokemonName.name;
      hideSuggestions();
      searchPokemon();
    });

    suggestionsArea.append(button);
  });

  suggestionsArea.classList.add("is-visible");
}

function renderWeaknessCards(groups) {
  resultGroups.forEach((group) => {
    resultArea.append(createResultCard(group.title, groups[group.value]));
  });
}

function renderPokemonResult(pokemon, groups) {
  resultArea.innerHTML = "";

  const card = document.createElement("article");
  card.className = "pokemon-card";

  const image = document.createElement("img");
  image.src = pokemon.image;
  image.alt = `Sprite oficial de ${pokemon.name}`;

  const info = document.createElement("div");

  const title = document.createElement("h2");
  title.textContent = `${pokemon.name} ${formatDexNumber(pokemon.id)}`;

  const types = document.createElement("p");
  types.innerHTML = `<strong>Tipos:</strong> ${pokemon.types.join(" / ")}`;

  const abilities = document.createElement("p");
  abilities.innerHTML = `<strong>Habilidades:</strong> ${pokemon.abilities.join(", ")}`;

  info.append(title, types, abilities);
  card.append(image, info);

  resultArea.append(card);
  renderWeaknessCards(groups);
}

function renderEvolutionSection(evolutions) {
  const section = document.createElement("section");
  section.className = "evolution-section";

  const title = document.createElement("h2");
  title.textContent = "Evoluções";

  const list = document.createElement("div");
  list.className = "evolution-list";

  evolutions.forEach((evolution) => {
    const button = document.createElement("button");
    button.className = "evolution-card";
    button.type = "button";

    const image = document.createElement("img");
    image.src = evolution.image;
    image.alt = `Sprite de ${evolution.displayName}`;

    const label = document.createElement("span");
    label.className = "evolution-stage";
    label.textContent = evolution.stage;

    const name = document.createElement("strong");
    name.textContent = evolution.displayName;

    button.append(image, label, name);
    button.addEventListener("click", () => {
      searchInput.value = evolution.name;
      hideSuggestions();
      searchPokemon();
    });

    list.append(button);
  });

  section.append(title, list);
  resultArea.append(section);
}

function renderError(message) {
  resultArea.innerHTML = "";
  resultArea.append(createResultCard("Nao encontrado", [message]));
}

function setSelectedTypes(types) {
  typeOneSelect.value = types[0] ?? "";
  typeTwoSelect.value = types[1] ?? "";
}

async function fetchPokemon(name) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}`);

  if (response.ok) {
    return response.json();
  }

  if (response.status !== 404) {
    throw new Error("pokemon-not-found");
  }

  const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${encodeURIComponent(name)}`);

  if (!speciesResponse.ok) {
    throw new Error("pokemon-not-found");
  }

  const speciesData = await speciesResponse.json();
  const defaultVariety = speciesData.varieties.find((variety) => variety.is_default) || speciesData.varieties[0];
  const varietyResponse = await fetch(defaultVariety.pokemon.url);

  if (!varietyResponse.ok) {
    throw new Error("pokemon-not-found");
  }

  return varietyResponse.json();
}

async function fetchPokemonImage(name) {
  try {
    const pokemon = await fetchPokemon(name);
    return pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default || "icon.svg";
  } catch (error) {
    return "icon.svg";
  }
}

function flattenEvolutionChain(chain, depth = 0) {
  return [
    {
      name: chain.species.name,
      depth
    },
    ...chain.evolves_to.flatMap((evolution) => flattenEvolutionChain(evolution, depth + 1))
  ];
}

function getEvolutionStage(evolution, currentEvolution) {
  if (evolution.name === currentEvolution.name) {
    return "Atual";
  }

  if (evolution.depth < currentEvolution.depth) {
    return "Anterior";
  }

  if (evolution.depth > currentEvolution.depth) {
    return "Próxima";
  }

  return "Alternativa";
}

async function getEvolutionCards(pokemonData) {
  try {
    const speciesResponse = await fetch(pokemonData.species.url);

    if (!speciesResponse.ok) {
      return [];
    }

    const speciesData = await speciesResponse.json();
    const evolutionResponse = await fetch(speciesData.evolution_chain.url);

    if (!evolutionResponse.ok) {
      return [];
    }

    const evolutionData = await evolutionResponse.json();
    const evolutionNames = flattenEvolutionChain(evolutionData.chain);
    const currentEvolution = evolutionNames.find((evolution) => evolution.name === speciesData.name);

    if (!currentEvolution) {
      return [];
    }

    return Promise.all(
      evolutionNames.map(async (evolution) => ({
        ...evolution,
        stage: getEvolutionStage(evolution, currentEvolution),
        displayName: formatApiName(evolution.name),
        image: await fetchPokemonImage(evolution.name)
      }))
    );
  } catch (error) {
    return [];
  }
}

async function searchPokemon() {
  const pokemonName = normalizePokemonSearchTerm(searchInput.value);

  if (!pokemonName) {
    hideSuggestions();
    renderError("Digite o nome de um Pokémon para buscar.");
    return;
  }

  hideSuggestions();
  searchButton.disabled = true;
  searchButton.textContent = "Buscando...";

  try {
    const data = await fetchPokemon(pokemonName);
    const defenseTypes = data.types
      .sort((first, second) => first.slot - second.slot)
      .map((item) => item.type.name);

    setSelectedTypes(defenseTypes);

    const pokemon = {
      name: formatApiName(data.name),
      id: data.id,
      image: data.sprites.other["official-artwork"].front_default || data.sprites.front_default || "icon.svg",
      types: defenseTypes.map((type) => typeNames[type]),
      abilities: data.abilities.map((item) => formatApiName(item.ability.name))
    };

    const groups = calculateWeaknesses(defenseTypes);
    const evolutions = await getEvolutionCards(data);

    renderPokemonResult(pokemon, groups);

    if (evolutions.length) {
      renderEvolutionSection(evolutions);
    }
  } catch (error) {
    if (error.message === "pokemon-not-found") {
      renderError("Pokémon nao encontrado. Confira o nome e tente novamente.");
      return;
    }

    renderError("Nao foi possivel buscar agora. Verifique sua conexao e tente novamente.");
  } finally {
    searchButton.disabled = false;
    searchButton.textContent = "Buscar Pokémon";
  }
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

searchButton.addEventListener("click", searchPokemon);

searchInput.addEventListener("input", renderSuggestions);

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    hideSuggestions();
    searchPokemon();
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".search-field")) {
    hideSuggestions();
  }
});

loadPokemonList();
