import { saveToLocalStorage, getLocalStorage, removeFromLocalStorage } from "./localstorage.js";

//ids
let randomBtn = document.getElementById("randomBtn");
let getFavsBtn = document.getElementById("getFavsBtn");
let getFavsDiv = document.getElementById("getFavsDiv");
let searchInput = document.getElementById("searchInput");
let searchBtn = document.getElementById("searchBtn");
let pokeIndex = document.getElementById("pokeIndex");
let pokeName = document.getElementById("pokeName");
let favBtn = document.getElementById("favBtn");
let favImg = document.getElementById("favImg");
let pokeImg = document.getElementById("pokeImg");
let elementsInfo = document.getElementById("elementsInfo");
let locationInfo = document.getElementById("locationInfo");
let abilitiesInfo = document.getElementById("abilitiesInfo");
let movesInfo = document.getElementById("movesInfo");
let evolutionPath = document.getElementById("evolutionPath");
let shinyBtn = document.getElementById("shinyBtn");
let originalBtn = document.getElementById("originalBtn");

let evolving = [];

let globalPokemon = "";


const pokemonApi = async (pokemon) => {
    const promise = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
    const data = await promise.json();
    // console.log(data);
    return data;
}

const pokeSpecies = async (species) => {
    const promise = await fetch(species)
    const data = await promise.json();
    return data;
}

const pokeEvolve =  async (evolution) => {
    const promise = await fetch (evolution)
    const data = await promise.json();
    return data;
}

const pokeLocation = async (pokemonArea) => {
    const promise = await fetch(pokemonArea);
    const data = await promise.json();
    return data;
}

// pokemonApi();

searchInput.addEventListener('keypress', (e) => {

    searchInput.value = e.target.value;
});


searchBtn.addEventListener('click', async () => {
    console.log(searchInput.value)
    let pokemon = await pokemonApi(searchInput.value)
    let species = await pokeSpecies(pokemon.species.url)
    let evolve = await pokeEvolve(species.evolution_chain.url)
    let findLoc = await pokeLocation(pokemon.location_area_encounters);


    if(searchInput.value && pokemon.id < 649) {

        globalPokemon = searchInput.value;

        const elements = pokemon.types.map(element => element.type.name).join(", ");

        const abilities = pokemon.abilities.map(element => element.ability.name).join(", ");
    
        const moves = pokemon.moves.map(element => element.move.name).join(", ");
    
        console.log(findLoc);
        const location = findLoc[0].location_area.name;
        // console.log(location);
    
        evolving.push(evolve.chain.species.name);
    
        const evolution = evolve.chain.evolves_to.map(element => {
            evolving.push(element.species.name);
        })
    
        const evolution2 = evolve.chain.evolves_to.map(element => { 
            element.evolves_to.map(element => {
                evolving.push(element.species.name);
        })})
        
        console.log(evolving);
    
        pokeIndex.textContent = pokemon.id;
        pokeName.textContent = pokemon.name;
        pokeImg.src = pokemon.sprites.other["official-artwork"].front_default;
        elementsInfo.textContent = elements;
        abilitiesInfo.textContent = abilities;
        movesInfo.textContent = moves;
        evolutionPath.textContent = evolving.join(", ");

        if(findLoc[0].length == 0){
            locationInfo.textContent = "unknown";
        } else {
            locationInfo.textContent = location;
        }

        shinyBtn.addEventListener('click', async () => {
            pokeImg.src = pokemon.sprites.other["official-artwork"].front_shiny;
        })

        originalBtn.addEventListener('click', async () => {
            pokeImg.src = pokemon.sprites.other["official-artwork"].front_default;
        })

        favHeart(pokemon.name);
        evolving = [];
    } else {
        alert('please enter a pokemon in generation 1-5 only!')
    }

})



const favHeart = (pokemon) => {
    
    let favorites = getLocalStorage();
    console.log(favorites)

    if(favorites.includes(pokemon)) {
        favImg.src = '../assets/filledheart.png'
    } else {
        favImg.src = '../assets/Heart.png'
    }
};

favBtn.addEventListener('click', async () => {

    let pokemon = await pokemonApi(globalPokemon)
    console.log(getLocalStorage());

    saveToLocalStorage(pokemon.name);

    favHeart(pokemon.name);
})

getFavsBtn.addEventListener('click', async () => {

    let favorites = getLocalStorage();

    getFavsDiv.textContent = "";

    favorites.map(async (pokeGoName) => {

        let pokemon = await pokemonApi(pokeGoName)

        let img = document.createElement("img")
        img.src = pokemon.sprites.other["official-artwork"].front_default;
        img.alt = "pokemon image"
        img.className = "sm-w-10 sm-h-10"

        let firstspan = document.createElement("span");
        firstspan.className = "text-xl uppercase mt-5 hidden lg:block";
        firstspan.textContent = pokeGoName;

        let secondspan = document.createElement("span");
        secondspan.className = "text-xl lg:hidden";
        secondspan.textContent = pokemon.id;

        let button2 = document.createElement("button");
        button2.type = "button";
        button2.textContent = "-";
        button2.classList.add("text-gray-400", "bg-transparent", "hover:bg-gray-200", "hover:text-gray-900", "rounded-lg", "text-xl", "h-8", "flex", "justify-center","ml-5");

        let div = document.createElement("div")
        div.className = "bg-mainColor text-black text-lg font-bold p-2 grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 shadow-lg"

        div.appendChild(secondspan);
        div.appendChild(firstspan);
        div.appendChild(img);
        // button.appendChild(img);
        // div.appendChild(button);
        div.appendChild(button2);


        button2.addEventListener('click', () => {
            removeFromLocalStorage(pokeGoName);
            div.remove();
        })

        getFavsDiv.appendChild(div);
    })
})

randomBtn.addEventListener('click', async () => {

    let random = Math.floor(Math.random() * 650)

    let pokemon = await pokemonApi(random)
    let species = await pokeSpecies(pokemon.species.url)
    let evolve = await pokeEvolve(species.evolution_chain.url)
    let findLoc = await pokeLocation(pokemon.location_area_encounters);

    globalPokemon = pokemon.name;

    const elements = pokemon.types.map(element => element.type.name).join(", ");

    const abilities = pokemon.abilities.map(element => element.ability.name).join(", ");

    const moves = pokemon.moves.map(element => element.move.name).join(", ");

    const location = findLoc[0].location_area.name;
    console.log(location);

    evolving.push(evolve.chain.species.name);

    const evolution = evolve.chain.evolves_to.map(element => {
        evolving.push(element.species.name);
    })

    const evolution2 = evolve.chain.evolves_to.map(element => { 
        element.evolves_to.map(element => {
            evolving.push(element.species.name);
    })})

    pokeIndex.textContent = pokemon.id;
    pokeName.textContent = pokemon.name;
    pokeImg.src = pokemon.sprites.other["official-artwork"].front_default;
    elementsInfo.textContent = elements;
    abilitiesInfo.textContent = abilities;
    movesInfo.textContent = moves;
    evolutionPath.textContent = evolving.join(", ");

    if(findLoc.length == 0){
        locationInfo.textContent = "unknown";
    } else {
        locationInfo.textContent = location;
    }

    shinyBtn.addEventListener('click', async () => {
        pokeImg.src = pokemon.sprites.other["official-artwork"].front_shiny;
    })

    originalBtn.addEventListener('click', async () => {
        pokeImg.src = pokemon.sprites.other["official-artwork"].front_default;
    })

    console.log(globalPokemon);
    favHeart(globalPokemon);
    evolving = [];

})