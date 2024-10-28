const apiUrl = "https://pokeapi.co/api/v2/pokemon/";
const baseUrl = "https://pokeapi.co/api/v2/";
let randomNumber;

// ランダムボタンをクリックしてポケモンの情報を取得する
document.getElementById("random-btm").addEventListener("click",
  async () => {
    randomNumber = Math.floor(Math.random() * 1025);
    const response = await fetch(apiUrl + randomNumber);
  const pokemon = await response.json();
  const image = document.createElement("img");
  const name = document.createElement("p");
  image.src = pokemon.sprites.front_default;
  name.textContent = pokemon.name;
  const pokemonDiv = document.getElementById("pokemon");
  pokemonDiv.innerHTML = "";
  pokemonDiv.appendChild(image);
  pokemonDiv.appendChild(name);
});

// ポケモンの名前を入力して検索ボタンをクリックしてポケモンの情報を取得する
document.getElementById("search-btm").addEventListener("click",
  async () => {
    try {
    const searchName = document.getElementById("js-poke-form").value.toLowerCase();
    const response = await fetch(apiUrl + searchName);
    const pokemon = await response.json();
    const image = document.createElement("img");
    const nameElement = document.createElement("p");
    image.src = pokemon.sprites.front_default;
    nameElement.textContent = pokemon.name;
    const pokemonDiv = document.getElementById("pokemon");
    pokemonDiv.innerHTML = "";
    pokemonDiv.appendChild(image);
    pokemonDiv.appendChild(nameElement);
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
      alert("ポケモンが見つかりませんでした");
    }
});


//ポケモンを一覧表示する
const getPokemon = () => {
  const promise = [];
  for (let i= 1; i < 1026; i++) {
    const url = "https://pokeapi.co/api/v2/pokemon/" + i;
    promise.push(fetch(url).then(response => response.json()));
  }

  Promise.all(promise).then( results => {
    const pokemonData = results.map( pokemon => {
      return {
        id: pokemon.id,
        image: pokemon.sprites.front_default,
        name: pokemon.name
      }
    });
    displayPokemon(pokemonData);
  })
  .catch(error => {
    console.error("Error fetching Pokémon data:", error);
  });
}

const displayPokemon = (pokemon) => {
  const pokemonHTMLString = pokemon.map( poke => `
    <li class="card" data-id="${poke.id}">
      <img class="card-image" src="${poke.image}" />
      <h2 class="card-title">${poke.name}</h2>
    </li>
      `).join("");
  pokedex.innerHTML = pokemonHTMLString;

  // カードをクリックしてモーダルウィンドウを表示する
  const openListPokemon = document.querySelectorAll(".card");
  openListPokemon.forEach(card => {
    card.addEventListener("click", async () => {
      const pokemonId = card.getAttribute("data-id");
      const response = await fetch(apiUrl + pokemonId);
      const pokemonData = await response.json();
      const speciesUrl = await fetch(baseUrl + "pokemon-species/" + pokemonId);
      const species = await speciesUrl.json();
      const modalContent = document.querySelector(".modal-content");

    // ポケモンの説明を取得
      const getFlavorText = (entries, version) => {
      return entries.filter(v => v.language.name === "ja" && v.version.name === version)[0]?.flavor_text || null;
      };
    const flavorTextEntries = species.flavor_text_entries;
    let flavorText = getFlavorText(flavorTextEntries, "sword") || 
                      getFlavorText(flavorTextEntries, "shield") ||
                      getFlavorText(flavorTextEntries, "x") ||
                      getFlavorText(flavorTextEntries, "y") || 
                      getFlavorText(flavorTextEntries, "sun") ||
                      getFlavorText(flavorTextEntries, "moon") ||
                      getFlavorText(flavorTextEntries, "ultra-sun") ||
                      getFlavorText(flavorTextEntries, "ultra-moon") ||
                      "日本語での説明が見つかりません";
    
    // タイプを取得
    const responseTypes = pokemonData.types;
    const typeNumber = responseTypes.length;
    let types = "";
    for (let i = 0; i < typeNumber; i++) {
      const responseType = await fetch(responseTypes[i].type.url);
      const pokemonType = await responseType.json();
      const responseTypeName = pokemonType.names;
      const type = responseTypeName.find((v) => v.language.name == "ja");
      if (i > 0) {
        types += '/';
      }
      types += type.name;
    }
    
    modalContent.innerHTML = `
      <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
      <h2>名前：${species.names.find(v => v.language.name === "ja").name}</h2>
      <p>タイプ: ${types}</p>
      <p>説明: ${flavorText}</p>
    `;
    openModal();
    });
  });
}

getPokemon();


// モーダルウィンドウを表示する
const modal = document.querySelector(".js-modal");
const close = document.querySelector(".js-modal-close");

function openModal() {
  modal.classList.add("is-active");
}
function closeModal() {
  modal.classList.remove("is-active"); 
}
close.addEventListener("click", closeModal);





// 検索ボタンかランダムボタンによって表示されたポケモンの情報をモーダルウィンドウに表示する
document.getElementById("pokemon").addEventListener("click",
  async () => {
    const pokeName = document.querySelector("#pokemon p").textContent.toLowerCase();

    try {
      const response = await fetch(apiUrl + pokeName);
      const pokemon = await response.json();
      const speciesUrl = await fetch(baseUrl + "pokemon-species/" + pokemon.id);
      const species = await speciesUrl.json();
      const modalContent = document.querySelector(".modal-content");

      // ポケモンの説明を取得
      const getFlavorText = (entries, version) => {
        return entries.filter(v => v.language.name === "ja" && v.version.name === version)[0]?.flavor_text || null;
      };
      const flavorTextEntries = species.flavor_text_entries;
      let flavorText = getFlavorText(flavorTextEntries, "sword") || 
                      getFlavorText(flavorTextEntries, "y") || 
                      getFlavorText(flavorTextEntries, "sun") ||
                      getFlavorText(flavorTextEntries, "violet") ||
                      "説明が見つかりません";
      
      // タイプを取得
      const responseTypes = pokemon.types;
      const typeNumber = responseTypes.length;
      let types = "";
      for (let i = 0; i < typeNumber; i++) {
        const responseType = await fetch(responseTypes[i].type.url);
        const pokemonType = await responseType.json();
        const responseTypeName = pokemonType.names;
        const type = responseTypeName.find((v) => v.language.name == "ja");
        if (i > 0) {
          types += '/';
        }
        types += type.name;
      }
      
      modalContent.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <h2>名前：${species.names.find(v => v.language.name === "ja").name}</h2>
        <p>タイプ: ${types}</p>
        <p>説明: ${flavorText}</p>
      `;
      openModal();
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
    alert("ポケモンの情報を取得できませんでした。");
  }
});



