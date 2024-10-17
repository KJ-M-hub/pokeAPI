const apiUrl = "https://pokeapi.co/api/v2/pokemon/";

document.getElementById("get").addEventListener("click",
  async () => {
    const response = await fetch(apiUrl + Math.floor(Math.random() * 493));
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

const getPokemon = () => {
  const promise = [];
  for (let i= 1; i < 1026; i++) {
    const url = "https://pokeapi.co/api/v2/pokemon/" + i;
    promise.push(fetch(url).then(response => response.json()));
  }

  Promise.all(promise).then( results => {
    const pokemon = results.map( pokemon => {
      return {
        image: pokemon.sprites.front_default,
        name: pokemon.name
      }
    });
    displayPokemon(pokemon);
  })
  .catch(error => {
    console.error("Error fetching Pokémon data:", error);
  });
}

const displayPokemon = (pokemon) => {
  console.log(pokemon);
  const pokemonHTNLString = pokemon.map( poke => `
    <li class="card">
      <img class="card-image" src="${poke.image}" />
      <h2 class="card-title">${poke.name}</h2>
    </li>
      `).join("");
  pokedex.innerHTML = pokemonHTNLString;
}

getPokemon();
