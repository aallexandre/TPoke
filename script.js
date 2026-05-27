const typeOneSelect = document.querySelector("#type-one");
const typeTwoSelect = document.querySelector("#type-two");
const calculateButton = document.querySelector("#calculate-button");
const showTypePokemonButton = document.querySelector("#show-type-pokemon-button");
const searchInput = document.querySelector("#pokemon-search");
const searchButton = document.querySelector("#search-button");
const suggestionsArea = document.querySelector("#pokemon-suggestions");
const resultArea = document.querySelector("#result");
const teamOpenButton = document.querySelector("#team-open-button");
const teamCloseButton = document.querySelector("#team-close-button");
const teamPanel = document.querySelector("#team-panel");
const teamTabs = document.querySelector("#team-tabs");
const teamNameInput = document.querySelector("#team-name-input");
const teamPokemonSearchInput = document.querySelector("#team-pokemon-search");
const teamPokemonSuggestionsArea = document.querySelector("#team-pokemon-suggestions");
const teamMessage = document.querySelector("#team-message");
const teamAddCurrentButton = document.querySelector("#team-add-current-button");
const teamClearButton = document.querySelector("#team-clear-button");
const teamPokemonList = document.querySelector("#team-pokemon-list");
const teamDefenseAnalysis = document.querySelector("#team-defense-analysis");
const teamOffenseAnalysis = document.querySelector("#team-offense-analysis");

const TEAMS_STORAGE_KEY = "pokeweakness-teams";
const ACTIVE_TEAM_STORAGE_KEY = "pokeweakness-active-team";
const MAX_TEAMS = 6;
const MAX_TEAM_SIZE = 6;
const INITIAL_MOVES_LIMIT = 20;
const TYPE_MATCH_LIMIT = 60;
const VERSION_GROUP_ORDER = [
  "red-blue",
  "yellow",
  "gold-silver",
  "crystal",
  "ruby-sapphire",
  "emerald",
  "firered-leafgreen",
  "diamond-pearl",
  "platinum",
  "heartgold-soulsilver",
  "black-white",
  "black-2-white-2",
  "x-y",
  "omega-ruby-alpha-sapphire",
  "sun-moon",
  "ultra-sun-ultra-moon",
  "lets-go-pikachu-lets-go-eevee",
  "sword-shield",
  "brilliant-diamond-and-shining-pearl",
  "legends-arceus",
  "scarlet-violet"
];

let pokemonList = [];
let currentPokemon = null;
let currentPokemonMoveEntries = [];
let naturalMoves = [];
let naturalMovesVisible = false;
let naturalMovesExpanded = false;
let naturalMovesLoadedFor = null;
let currentEvolutionCards = null;
let currentOtherForms = [];
let activeTeamIndex = 0;
let teams = createDefaultTeams();

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

// Autocomplete carregado uma vez da PokéAPI e filtrado em memória.
function hideSuggestions() {
  hideSuggestionList(suggestionsArea);
}

function renderSuggestions() {
  renderPokemonSuggestions(searchInput, suggestionsArea, (pokemonName) => {
    searchInput.value = pokemonName;
    hideSuggestions();
    searchPokemon();
  });
}

function hideTeamSuggestions() {
  hideSuggestionList(teamPokemonSuggestionsArea);
}

function renderTeamSuggestions() {
  renderPokemonSuggestions(teamPokemonSearchInput, teamPokemonSuggestionsArea, (pokemonName) => {
    teamPokemonSearchInput.value = pokemonName;
    hideTeamSuggestions();
    addPokemonToActiveTeam(pokemonName);
  });
}

function hideSuggestionList(area) {
  area.innerHTML = "";
  area.classList.remove("is-visible");
}

function renderPokemonSuggestions(input, area, onSelect) {
  const rawSearchText = input.value.trim().toLowerCase();
  const searchText = normalizePokemonName(rawSearchText);

  if (!rawSearchText) {
    hideSuggestionList(area);
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

  area.innerHTML = "";

  if (!suggestions.length) {
    hideSuggestionList(area);
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
      onSelect(pokemonName.name);
    });

    area.append(button);
  });

  area.classList.add("is-visible");
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

  const baseStats = createBaseStatsSection(pokemon.baseStats);

  const movesButton = document.createElement("button");
  movesButton.className = "moves-toggle-button";
  movesButton.type = "button";
  movesButton.textContent = naturalMovesVisible ? "Esconder golpes naturais" : "Ver golpes naturais";
  movesButton.addEventListener("click", toggleNaturalMoves);

  info.append(title, types, abilities, baseStats, movesButton);
  card.append(image, info);

  resultArea.append(card);

  if (naturalMovesVisible) {
    renderNaturalMovesSection();
  }

  if (currentEvolutionCards) {
    renderEvolutionSection(currentEvolutionCards);
  }

  renderWeaknessCards(groups);
  renderOtherFormsSection(currentOtherForms);
}

function getVersionGroupRank(versionGroupName) {
  const index = VERSION_GROUP_ORDER.indexOf(versionGroupName);
  return index === -1 ? -1 : index;
}

function getLatestLevelUpDetail(moveEntry) {
  return moveEntry.version_group_details
    .filter((detail) => detail.move_learn_method.name === "level-up")
    .sort((first, second) => {
      return getVersionGroupRank(second.version_group.name) - getVersionGroupRank(first.version_group.name);
    })[0];
}

function getUniqueNaturalMoveEntries(moveEntries) {
  const movesByName = new Map();

  moveEntries.forEach((moveEntry) => {
    const detail = getLatestLevelUpDetail(moveEntry);

    if (!detail) {
      return;
    }

    const existing = movesByName.get(moveEntry.move.name);

    if (!existing || getVersionGroupRank(detail.version_group.name) > getVersionGroupRank(existing.detail.version_group.name)) {
      movesByName.set(moveEntry.move.name, {
        name: moveEntry.move.name,
        url: moveEntry.move.url,
        level: detail.level_learned_at || null,
        detail
      });
    }
  });

  return [...movesByName.values()].sort((first, second) => {
    const firstLevel = first.level ?? Number.POSITIVE_INFINITY;
    const secondLevel = second.level ?? Number.POSITIVE_INFINITY;

    return firstLevel - secondLevel || first.name.localeCompare(second.name);
  });
}

function formatMoveValue(value, fallback = "-") {
  return value === null || value === undefined ? fallback : String(value);
}

function formatMoveDamageClass(damageClass) {
  const names = {
    physical: "Físico",
    special: "Especial",
    status: "Status"
  };

  return names[damageClass] || formatApiName(damageClass);
}

function formatBaseStats(stats) {
  const statNames = {
    hp: "HP",
    attack: "Ataque",
    defense: "Defesa",
    "special-attack": "Ataque Esp.",
    "special-defense": "Defesa Esp.",
    speed: "Velocidade"
  };

  const items = stats.map((stat) => ({
    name: statNames[stat.stat.name] || formatApiName(stat.stat.name),
    value: stat.base_stat
  }));

  return {
    items,
    total: items.reduce((sum, stat) => sum + stat.value, 0)
  };
}

function createBaseStatsSection(baseStats) {
  const section = document.createElement("section");
  section.className = "base-stats";

  const title = document.createElement("h3");
  title.textContent = "Status Base";

  const list = document.createElement("div");
  list.className = "base-stats-list";

  baseStats.items.forEach((stat) => {
    const row = document.createElement("p");
    row.innerHTML = `<span>${stat.name}</span><strong>${stat.value}</strong>`;
    list.append(row);
  });

  const total = document.createElement("p");
  total.className = "base-stats-total";
  total.innerHTML = `<span>Total</span><strong>${baseStats.total}</strong>`;
  list.append(total);

  section.append(title, list);
  return section;
}

async function loadNaturalMoves() {
  if (!currentPokemon || naturalMovesLoadedFor === currentPokemon.apiName) {
    return;
  }

  naturalMoves = [];
  naturalMovesLoadedFor = currentPokemon.apiName;
  renderNaturalMovesSection("Carregando golpes naturais...");

  try {
    const moveEntries = getUniqueNaturalMoveEntries(currentPokemonMoveEntries);

    naturalMoves = await Promise.all(
      moveEntries.map(async (moveEntry) => {
        const response = await fetch(moveEntry.url);

        if (!response.ok) {
          throw new Error("move-load-failed");
        }

        const moveData = await response.json();

        return {
          name: formatApiName(moveEntry.name),
          level: moveEntry.level,
          type: typeNames[moveData.type.name] || formatApiName(moveData.type.name),
          category: formatMoveDamageClass(moveData.damage_class.name),
          power: moveData.power,
          accuracy: moveData.accuracy
        };
      })
    );

    if (!naturalMovesVisible) {
      return;
    }

    renderNaturalMovesSection();
  } catch (error) {
    naturalMovesLoadedFor = null;

    if (!naturalMovesVisible) {
      return;
    }

    renderNaturalMovesSection("Não foi possível carregar os golpes agora.");
  }
}

async function toggleNaturalMoves() {
  naturalMovesVisible = !naturalMovesVisible;

  if (!naturalMovesVisible) {
    renderPokemonResult(currentPokemon, calculateWeaknesses(currentPokemon.typeIds));
    return;
  }

  renderPokemonResult(currentPokemon, calculateWeaknesses(currentPokemon.typeIds));
  await loadNaturalMoves();
}

function renderNaturalMovesSection(loadingMessage = "") {
  const existingSection = document.querySelector(".moves-section");

  if (existingSection) {
    existingSection.remove();
  }

  const section = document.createElement("section");
  section.className = "moves-section";

  const title = document.createElement("h2");
  title.textContent = "Golpes naturais";
  section.append(title);

  if (loadingMessage) {
    const loading = document.createElement("p");
    loading.className = "moves-loading";
    loading.textContent = loadingMessage;
    section.append(loading);
  } else if (!naturalMoves.length) {
    const empty = document.createElement("p");
    empty.className = "moves-loading";
    empty.textContent = "Nenhum golpe natural encontrado.";
    section.append(empty);
  } else {
    const list = document.createElement("div");
    list.className = "moves-list";

    const visibleMoves = naturalMovesExpanded ? naturalMoves : naturalMoves.slice(0, INITIAL_MOVES_LIMIT);

    visibleMoves.forEach((move) => {
      const card = document.createElement("article");
      card.className = "move-card";

      const name = document.createElement("strong");
      name.textContent = move.name;

      const level = document.createElement("span");
      level.textContent = move.level ? `Level ${move.level}` : "Level -";

      const details = document.createElement("p");
      details.textContent = `${move.type} | ${move.category} | Poder ${formatMoveValue(move.power)} | Precisão ${formatMoveValue(move.accuracy)}`;

      card.append(name, level, details);
      list.append(card);
    });

    section.append(list);

    if (naturalMoves.length > INITIAL_MOVES_LIMIT && !naturalMovesExpanded) {
      const moreButton = document.createElement("button");
      moreButton.className = "moves-more-button";
      moreButton.type = "button";
      moreButton.textContent = "Mostrar mais golpes";
      moreButton.addEventListener("click", () => {
        naturalMovesExpanded = true;
        renderNaturalMovesSection();
      });

      section.append(moreButton);
    }
  }

  const pokemonCard = resultArea.querySelector(".pokemon-card");
  pokemonCard.after(section);
}

function createEvolutionPokemonCard(evolution) {
  const button = document.createElement("button");
  button.className = `evolution-card${evolution.isCurrent ? " is-current" : ""}`;
  button.type = "button";

  const image = document.createElement("img");
  image.src = evolution.image;
  image.alt = `Sprite de ${evolution.displayName}`;

  const label = document.createElement("span");
  label.className = "evolution-stage";
  label.textContent = evolution.isCurrent ? "Atual" : "Evolução";

  const name = document.createElement("strong");
  name.textContent = evolution.displayName;

  button.append(image, label, name);
  button.addEventListener("click", () => {
    searchInput.value = evolution.name;
    hideSuggestions();
    searchPokemon();
  });

  return button;
}

function createEvolutionMethod(methods) {
  const wrapper = document.createElement("div");
  wrapper.className = "evolution-method";

  const arrowTop = document.createElement("span");
  arrowTop.className = "evolution-arrow";
  arrowTop.textContent = "↓";

  const badges = document.createElement("div");
  badges.className = "evolution-badges";

  methods.forEach((method) => {
    const badge = document.createElement("span");
    badge.className = "evolution-badge";
    badge.textContent = method;
    badges.append(badge);
  });

  const arrowBottom = document.createElement("span");
  arrowBottom.className = "evolution-arrow";
  arrowBottom.textContent = "↓";

  wrapper.append(arrowTop, badges, arrowBottom);
  return wrapper;
}

function createEvolutionBranch(evolution) {
  const branch = document.createElement("div");
  branch.className = "evolution-branch";
  branch.append(createEvolutionPokemonCard(evolution));

  if (evolution.children.length) {
    const children = document.createElement("div");
    children.className = "evolution-children";

    evolution.children.forEach((child) => {
      const path = document.createElement("div");
      path.className = "evolution-path";
      path.append(createEvolutionMethod(child.methods), createEvolutionBranch(child));
      children.append(path);
    });

    branch.append(children);
  }

  return branch;
}

function renderEvolutionSection(evolutions) {
  const section = document.createElement("section");
  section.className = "evolution-section";

  const title = document.createElement("h2");
  title.textContent = "Evoluções";

  if (!evolutions || !evolutions.hasEvolution) {
    const message = document.createElement("p");
    message.className = "evolution-empty";
    message.textContent = "Este Pokémon não possui evolução.";
    section.append(title, message);
    resultArea.append(section);
    return;
  }

  const tree = document.createElement("div");
  tree.className = "evolution-tree";
  tree.append(createEvolutionBranch(evolutions.root));

  section.append(title, tree);
  resultArea.append(section);
}

function renderError(message) {
  resultArea.innerHTML = "";
  resultArea.append(createResultCard("Nao encontrado", [message]));
}

function renderLoading(titleText, message) {
  resultArea.innerHTML = "";
  resultArea.append(createResultCard(titleText, [message]));
}

function setSelectedTypes(types) {
  typeOneSelect.value = types[0] ?? "";
  typeTwoSelect.value = types[1] ?? "";
}

// Busca por nome, alias com espaços ou número da Pokédex.
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

async function fetchPokemonByType(typeId) {
  const response = await fetch(`https://pokeapi.co/api/v2/type/${encodeURIComponent(typeId)}`);

  if (!response.ok) {
    throw new Error("type-load-failed");
  }

  const data = await response.json();
  return data.pokemon.map((entry) => entry.pokemon.name);
}

function createTypeMatchCard(pokemon) {
  const button = document.createElement("button");
  button.className = "type-match-card";
  button.type = "button";

  const image = document.createElement("img");
  image.src = pokemon.image;
  image.alt = `Sprite de ${pokemon.name}`;

  const content = document.createElement("div");

  const title = document.createElement("strong");
  title.textContent = `${pokemon.name} ${formatDexNumber(pokemon.id)}`;

  const types = document.createElement("span");
  types.textContent = pokemon.types.join(" / ");

  content.append(title, types);
  button.append(image, content);

  button.addEventListener("click", () => {
    searchInput.value = pokemon.apiName;
    searchPokemon();
  });

  return button;
}

function renderTypeMatches(pokemonListByType, defenseTypes) {
  resultArea.innerHTML = "";

  const section = document.createElement("section");
  section.className = "type-match-section";

  const title = document.createElement("h2");
  title.textContent = "Pokémon com essa tipagem";

  const description = document.createElement("p");
  description.textContent = `Tipos selecionados: ${defenseTypes.map((type) => typeNames[type]).join(" / ")}`;

  const list = document.createElement("div");
  list.className = "type-match-list";

  pokemonListByType.forEach((pokemon) => {
    list.append(createTypeMatchCard(pokemon));
  });

  section.append(title, description, list);
  resultArea.append(section);
}

async function showPokemonWithSelectedTypes() {
  const typeOne = typeOneSelect.value;
  const typeTwo = typeTwoSelect.value;

  if (!typeOne) {
    renderError("Escolha pelo menos o Tipo 1 para listar Pokémon.");
    return;
  }

  if (typeOne === typeTwo) {
    renderError("Escolha tipos diferentes ou deixe o Tipo 2 como Nenhum.");
    return;
  }

  const defenseTypes = typeTwo ? [typeOne, typeTwo] : [typeOne];
  renderLoading("Carregando", "Buscando Pokémon com essa tipagem...");

  try {
    const typeLists = await Promise.all(defenseTypes.map(fetchPokemonByType));
    const matchingNames = typeLists
      .reduce((matches, names) => matches.filter((name) => names.includes(name)))
      .slice(0, TYPE_MATCH_LIMIT);

    if (!matchingNames.length) {
      renderError("Nenhum Pokémon encontrado com essa tipagem.");
      return;
    }

    const pokemonDetails = await Promise.all(
      matchingNames.map(async (name) => createTeamPokemonFromData(await fetchPokemon(name)))
    );

    pokemonDetails.sort((first, second) => first.id - second.id);
    renderTypeMatches(pokemonDetails, defenseTypes);
  } catch (error) {
    renderError("Não foi possível carregar essa lista agora. Tente novamente.");
  }
}

function formatEvolutionName(entity) {
  return entity ? formatApiName(entity.name) : "";
}

function formatTimeOfDay(timeOfDay) {
  const times = {
    day: "durante o dia",
    night: "durante a noite"
  };

  return times[timeOfDay] || `durante ${formatApiName(timeOfDay)}`;
}

function formatEvolutionMethods(details) {
  const detail = details[0] || {};
  const methods = [];

  if (detail.min_level) {
    methods.push(`Evolui no nível ${detail.min_level}`);
  }

  if (detail.item) {
    methods.push(`Usar ${formatEvolutionName(detail.item)}`);
  }

  if (detail.trigger?.name === "trade") {
    methods.push("Evolui por troca");
  }

  if (detail.held_item) {
    methods.push(`Trocar segurando ${formatEvolutionName(detail.held_item)}`);
  }

  if (detail.known_move) {
    methods.push(`Subir de nível sabendo ${formatEvolutionName(detail.known_move)}`);
  }

  if (detail.known_move_type) {
    methods.push(`Subir de nível sabendo golpe do tipo ${formatEvolutionName(detail.known_move_type)}`);
  }

  if (detail.min_happiness) {
    methods.push("Evolui com amizade alta");
  }

  if (detail.min_beauty) {
    methods.push("Evolui com beleza alta");
  }

  if (detail.min_affection) {
    methods.push("Evolui com afeição alta");
  }

  if (detail.time_of_day) {
    methods.push(formatTimeOfDay(detail.time_of_day));
  }

  if (detail.location) {
    methods.push(`Evolui em ${formatEvolutionName(detail.location)}`);
  }

  if (detail.gender === 1) {
    methods.push("somente fêmea");
  } else if (detail.gender === 2) {
    methods.push("somente macho");
  }

  if (detail.party_species) {
    methods.push(`com ${formatEvolutionName(detail.party_species)} no time`);
  }

  if (detail.party_type) {
    methods.push(`com Pokémon do tipo ${formatEvolutionName(detail.party_type)} no time`);
  }

  if (detail.trade_species) {
    methods.push(`trocar por ${formatEvolutionName(detail.trade_species)}`);
  }

  if (detail.needs_overworld_rain) {
    methods.push("durante chuva no mapa");
  }

  if (detail.turn_upside_down) {
    methods.push("virando o console de cabeça para baixo");
  }

  return methods.length ? methods : ["Método especial"];
}

async function createEvolutionNode(chain, currentSpeciesName, evolutionDetails = []) {
  return {
    name: chain.species.name,
    displayName: formatApiName(chain.species.name),
    image: await fetchPokemonImage(chain.species.name),
    isCurrent: chain.species.name === currentSpeciesName,
    methods: formatEvolutionMethods(evolutionDetails),
    children: await Promise.all(
      chain.evolves_to.map((evolution) => {
        return createEvolutionNode(evolution, currentSpeciesName, evolution.evolution_details);
      })
    )
  };
}

async function getEvolutionCards(pokemonData) {
  try {
    const speciesResponse = await fetch(pokemonData.species.url);

    if (!speciesResponse.ok) {
      return null;
    }

    const speciesData = await speciesResponse.json();
    const evolutionResponse = await fetch(speciesData.evolution_chain.url);

    if (!evolutionResponse.ok) {
      return null;
    }

    const evolutionData = await evolutionResponse.json();
    const root = await createEvolutionNode(evolutionData.chain, speciesData.name);

    return {
      root,
      hasEvolution: root.children.length > 0
    };
  } catch (error) {
    return null;
  }
}

function getFormCategory(formName) {
  if (formName.includes("mega")) {
    return 1;
  }

  if (formName.includes("gmax") || formName.includes("gigantamax")) {
    return 2;
  }

  if (["alola", "galar", "hisui", "paldea"].some((keyword) => formName.includes(keyword))) {
    return 3;
  }

  return 4;
}

function getPokemonImage(data) {
  return data.sprites.other["official-artwork"].front_default || data.sprites.front_default || "";
}

async function getOtherForms(pokemonData) {
  try {
    const speciesResponse = await fetch(pokemonData.species.url);

    if (!speciesResponse.ok) {
      return [];
    }

    const speciesData = await speciesResponse.json();
    const forms = await Promise.all(
      speciesData.varieties.map(async (variety) => {
        const response = await fetch(variety.pokemon.url);

        if (!response.ok) {
          return null;
        }

        const data = await response.json();
        const image = getPokemonImage(data);

        if (!image || data.name === pokemonData.name) {
          return null;
        }

        const typeIds = data.types
          .sort((first, second) => first.slot - second.slot)
          .map((item) => item.type.name);

        return {
          apiName: data.name,
          name: formatApiName(data.name),
          id: data.id,
          image,
          types: typeIds.map((type) => typeNames[type]),
          category: getFormCategory(data.name)
        };
      })
    );

    return forms
      .filter(Boolean)
      .sort((first, second) => first.category - second.category || first.id - second.id || first.name.localeCompare(second.name));
  } catch (error) {
    return [];
  }
}

function renderOtherFormsSection(forms) {
  const section = document.createElement("section");
  section.className = "other-forms-section";

  const title = document.createElement("h2");
  title.textContent = "Outras Formas";
  section.append(title);

  if (!forms.length) {
    const message = document.createElement("p");
    message.className = "other-forms-empty";
    message.textContent = "Nenhuma outra forma encontrada.";
    section.append(message);
    resultArea.append(section);
    return;
  }

  const list = document.createElement("div");
  list.className = "other-forms-list";

  forms.forEach((form) => {
    const button = document.createElement("button");
    button.className = "other-form-card";
    button.type = "button";

    const image = document.createElement("img");
    image.src = form.image;
    image.alt = `Sprite de ${form.name}`;

    const name = document.createElement("strong");
    name.textContent = form.id ? `${form.name} ${formatDexNumber(form.id)}` : form.name;

    const types = document.createElement("span");
    types.textContent = form.types.join(" / ");

    button.append(image, name, types);
    button.addEventListener("click", () => {
      searchInput.value = form.apiName;
      hideSuggestions();
      searchPokemon();
    });

    list.append(button);
  });

  section.append(list);
  resultArea.append(section);
}

// Busca principal: atualiza o card, fraquezas e evoluções do Pokémon escolhido.
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
      apiName: data.name,
      id: data.id,
      image: getPokemonImage(data) || "icon.svg",
      types: defenseTypes.map((type) => typeNames[type]),
      typeIds: defenseTypes,
      abilities: data.abilities.map((item) => formatApiName(item.ability.name)),
      baseStats: formatBaseStats(data.stats)
    };

    currentPokemon = {
      name: pokemon.name,
      apiName: pokemon.apiName,
      id: pokemon.id,
      image: pokemon.image,
      types: pokemon.types,
      typeIds: pokemon.typeIds,
      abilities: pokemon.abilities,
      baseStats: pokemon.baseStats
    };
    currentPokemonMoveEntries = data.moves;
    naturalMoves = [];
    naturalMovesVisible = false;
    naturalMovesExpanded = false;
    naturalMovesLoadedFor = null;

    const groups = calculateWeaknesses(defenseTypes);
    const [evolutions, otherForms] = await Promise.all([
      getEvolutionCards(data),
      getOtherForms(data)
    ]);
    currentEvolutionCards = evolutions;
    currentOtherForms = otherForms;

    renderPokemonResult(pokemon, groups);
    renderTeamPanel();
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

// Meu Time: seis slots de time persistidos no navegador.
function createDefaultTeams() {
  return Array.from({ length: MAX_TEAMS }, (_, index) => ({
    name: `Time ${index + 1}`,
    pokemon: []
  }));
}

function loadTeams() {
  try {
    const savedTeams = JSON.parse(localStorage.getItem(TEAMS_STORAGE_KEY));

    if (Array.isArray(savedTeams)) {
      teams = createDefaultTeams().map((team, index) => ({
        ...team,
        ...(savedTeams[index] || {}),
        pokemon: Array.isArray(savedTeams[index]?.pokemon)
          ? savedTeams[index].pokemon.slice(0, MAX_TEAM_SIZE)
          : []
      }));
    }

    const savedActiveTeam = Number(localStorage.getItem(ACTIVE_TEAM_STORAGE_KEY));

    if (Number.isInteger(savedActiveTeam) && savedActiveTeam >= 0 && savedActiveTeam < MAX_TEAMS) {
      activeTeamIndex = savedActiveTeam;
    }
  } catch (error) {
    teams = createDefaultTeams();
    activeTeamIndex = 0;
  }
}

function saveTeams() {
  localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(teams));
  localStorage.setItem(ACTIVE_TEAM_STORAGE_KEY, String(activeTeamIndex));
}

function getActiveTeam() {
  return teams[activeTeamIndex];
}

function openTeamPanel() {
  teamPanel.classList.add("is-open");
  teamPanel.setAttribute("aria-hidden", "false");
  renderTeamPanel();
}

function closeTeamPanel() {
  teamPanel.classList.remove("is-open");
  teamPanel.setAttribute("aria-hidden", "true");
}

function renderTeamPanel() {
  renderTeamTabs();
  renderTeamName();
  renderTeamPokemon();
  renderTeamAnalysis();
  teamAddCurrentButton.disabled = !currentPokemon || getActiveTeam().pokemon.length >= MAX_TEAM_SIZE;
}

function setTeamMessage(message, isError = true) {
  teamMessage.textContent = message;
  teamMessage.classList.toggle("is-success", !isError);
}

function renderTeamTabs() {
  teamTabs.innerHTML = "";

  teams.forEach((team, index) => {
    const button = document.createElement("button");
    button.className = `team-tab${index === activeTeamIndex ? " is-active" : ""}`;
    button.type = "button";
    button.textContent = team.name || `Time ${index + 1}`;

    button.addEventListener("click", () => {
      activeTeamIndex = index;
      saveTeams();
      renderTeamPanel();
    });

    teamTabs.append(button);
  });
}

function renderTeamName() {
  teamNameInput.value = getActiveTeam().name;
}

function renderTeamPokemon() {
  const activeTeam = getActiveTeam();
  teamPokemonList.innerHTML = "";

  if (!activeTeam.pokemon.length) {
    const empty = document.createElement("p");
    empty.className = "empty-message";
    empty.textContent = "Nenhum Pokémon neste time.";
    teamPokemonList.append(empty);
    return;
  }

  activeTeam.pokemon.forEach((pokemon, index) => {
    const card = document.createElement("article");
    card.className = "team-pokemon-card";

    const image = document.createElement("img");
    image.src = pokemon.image;
    image.alt = `Sprite de ${pokemon.name}`;

    const content = document.createElement("div");

    const title = document.createElement("h4");
    title.textContent = `${pokemon.name} ${formatDexNumber(pokemon.id)}`;

    const types = document.createElement("p");
    types.textContent = pokemon.types.join(" / ");

    const removeButton = document.createElement("button");
    removeButton.className = "team-remove-button";
    removeButton.type = "button";
    removeButton.textContent = "Remover";
    removeButton.addEventListener("click", () => {
      activeTeam.pokemon.splice(index, 1);
      saveTeams();
      renderTeamPanel();
    });

    content.append(title, types, removeButton);
    card.append(image, content);
    teamPokemonList.append(card);
  });
}

function addCurrentPokemonToTeam() {
  if (!currentPokemon) {
    setTeamMessage("Busque um Pokémon primeiro ou use a busca do Meu Time.");
    return;
  }

  addPokemonObjectToActiveTeam(currentPokemon);
}

function addPokemonObjectToActiveTeam(pokemon) {
  const activeTeam = getActiveTeam();

  if (activeTeam.pokemon.length >= MAX_TEAM_SIZE) {
    setTeamMessage("Este time já tem 6 Pokémon.");
    return false;
  }

  if (activeTeam.pokemon.some((teamPokemon) => teamPokemon.id === pokemon.id)) {
    setTeamMessage(`${pokemon.name} já está neste time.`);
    return false;
  }

  activeTeam.pokemon.push({ ...pokemon });
  saveTeams();
  renderTeamPanel();
  setTeamMessage(`${pokemon.name} foi adicionado ao time.`, false);
  return true;
}

function createTeamPokemonFromData(data) {
  const typeIds = data.types
    .sort((first, second) => first.slot - second.slot)
    .map((item) => item.type.name);

  return {
    name: formatApiName(data.name),
    apiName: data.name,
    id: data.id,
    image: getPokemonImage(data) || "icon.svg",
    types: typeIds.map((type) => typeNames[type]),
    typeIds
  };
}

async function addPokemonToActiveTeam(searchValue) {
  const activeTeam = getActiveTeam();
  const pokemonName = normalizePokemonSearchTerm(searchValue || teamPokemonSearchInput.value);

  if (!pokemonName) {
    setTeamMessage("Digite o nome ou número de um Pokémon.");
    return;
  }

  if (activeTeam.pokemon.length >= MAX_TEAM_SIZE) {
    setTeamMessage("Este time já tem 6 Pokémon.");
    return;
  }

  setTeamMessage("Buscando Pokémon...", false);

  try {
    const data = await fetchPokemon(pokemonName);
    const added = addPokemonObjectToActiveTeam(createTeamPokemonFromData(data));

    if (added) {
      teamPokemonSearchInput.value = "";
      hideTeamSuggestions();
    }
  } catch (error) {
    setTeamMessage("Pokémon não encontrado. Confira o nome ou número.");
  }
}

function clearActiveTeam() {
  getActiveTeam().pokemon = [];
  saveTeams();
  renderTeamPanel();
  setTeamMessage("Time limpo.", false);
}

// Análise defensiva e ofensiva do time usando só a tabela de tipos.
function createAnalysisCard(titleText, lines) {
  const card = document.createElement("article");
  card.className = "analysis-card";

  const title = document.createElement("strong");
  title.textContent = titleText;

  card.append(title);

  lines.forEach((line) => {
    const text = document.createElement("span");
    text.textContent = line;
    card.append(text);
  });

  return card;
}

function renderTeamAnalysis() {
  const pokemon = getActiveTeam().pokemon;
  teamDefenseAnalysis.innerHTML = "";
  teamOffenseAnalysis.innerHTML = "";

  if (!pokemon.length) {
    teamDefenseAnalysis.append(createAnalysisCard("Sem dados", ["Adicione Pokémon para analisar o time."]));
    teamOffenseAnalysis.append(createAnalysisCard("Sem dados", ["Adicione Pokémon para analisar a cobertura."]));
    return;
  }

  renderTeamDefenseAnalysis(pokemon);
  renderTeamOffenseAnalysis(pokemon);
}

function renderTeamDefenseAnalysis(teamPokemon) {
  const analysis = allTypes
    .map((attackType) => {
      const counts = teamPokemon.reduce((total, pokemon) => {
        const multiplier = pokemon.typeIds.reduce((value, defenseType) => {
          return value * getAttackMultiplier(attackType, defenseType);
        }, 1);

        if (multiplier === 0) {
          total.immune += 1;
        } else if (multiplier > 1) {
          total.weak += 1;
        } else if (multiplier < 1) {
          total.resist += 1;
        }

        return total;
      }, { weak: 0, resist: 0, immune: 0 });

      return { attackType, ...counts };
    })
    .sort((first, second) => {
      return second.weak - first.weak || first.resist - second.resist || first.immune - second.immune;
    });

  analysis.forEach((item) => {
    teamDefenseAnalysis.append(createAnalysisCard(typeNames[item.attackType], [
      `${item.weak} fracos`,
      `${item.resist} resistem`,
      `${item.immune} imunes`
    ]));
  });
}

function renderTeamOffenseAnalysis(teamPokemon) {
  const attackingTypes = [...new Set(teamPokemon.flatMap((pokemon) => pokemon.typeIds))];
  const analysis = allTypes.map((defenseType) => {
    const bestMultiplier = attackingTypes.reduce((best, attackType) => {
      return Math.max(best, getAttackMultiplier(attackType, defenseType));
    }, 0);

    return { defenseType, bestMultiplier };
  });

  const covered = analysis.filter((item) => item.bestMultiplier > 1);
  const poor = analysis.filter((item) => item.bestMultiplier <= 1);

  teamOffenseAnalysis.append(createAnalysisCard("Bate super efetivo em", [
    covered.length ? covered.map((item) => typeNames[item.defenseType]).join(", ") : "Nenhum tipo"
  ]));

  teamOffenseAnalysis.append(createAnalysisCard("Cobre mal", [
    poor.length ? poor.map((item) => typeNames[item.defenseType]).join(", ") : "Nenhum tipo"
  ]));
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

showTypePokemonButton.addEventListener("click", showPokemonWithSelectedTypes);

searchButton.addEventListener("click", searchPokemon);

searchInput.addEventListener("input", renderSuggestions);

teamPokemonSearchInput.addEventListener("input", renderTeamSuggestions);

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    hideSuggestions();
    searchPokemon();
  }
});

teamPokemonSearchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    hideTeamSuggestions();
    addPokemonToActiveTeam();
  }
});

teamOpenButton.addEventListener("click", openTeamPanel);
teamCloseButton.addEventListener("click", closeTeamPanel);
teamAddCurrentButton.addEventListener("click", addCurrentPokemonToTeam);
teamClearButton.addEventListener("click", clearActiveTeam);

teamNameInput.addEventListener("input", () => {
  getActiveTeam().name = teamNameInput.value.trim() || `Time ${activeTeamIndex + 1}`;
  saveTeams();
  renderTeamTabs();
});

teamPanel.addEventListener("click", (event) => {
  if (event.target === teamPanel) {
    closeTeamPanel();
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".search-field")) {
    hideSuggestions();
  }

  if (!event.target.closest(".team-search-field")) {
    hideTeamSuggestions();
  }
});

loadTeams();
renderTeamPanel();
loadPokemonList();
