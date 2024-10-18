const apiUrl = "https://pokeapi.co/api/v2/pokemon/";


// ランダムボタンをクリックしてポケモンの情報を取得する
document.getElementById("random-btm").addEventListener("click",
  async () => {
    const response = await fetch(apiUrl + Math.floor(Math.random() * 1025));
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
  console.log(pokemon);
  const pokemonHTMLString = pokemon.map( poke => `
    <li class="card">
      <img class="card-image" src="${poke.image}" />
      <h2 class="card-title">${poke.name}</h2>
    </li>
      `).join("");
  pokedex.innerHTML = pokemonHTMLString;
}

getPokemon();


const modal = document.querySelector(".js-modal");
const open = document.getElementById("title");
const close = document.querySelector(".js-modal-close");

function openModal() {
  modal.classList.add("is-active");
}
open.addEventListener("click", openModal);

function closeModal() {
  modal.classList.remove("is-active"); 
}
close.addEventListener("click", closeModal);

//「モーダルの外側」をクリックしてモーダルを閉じる
function modalOut(e) {
  if (e.target == modal) {
    modal.classList.remove('is-active');
  }
}
addEventListener('click', modalOut);