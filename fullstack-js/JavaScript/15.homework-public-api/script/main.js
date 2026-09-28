"use strict";

const input = document.querySelector(".search-input");
const container = document.querySelector(".artists");
container.innerHTML = "";

input.addEventListener("input", handleInput);

function handleInput(e) {
    const searchQuery = e.target.value;

    if (searchQuery.length < 4) return;

    getArtistData(searchQuery)
        .then(({ results }) => {
            container.innerHTML = "";

            const artists = results.filter((artist) => artist.image);
            artists.forEach((artist) => {
                const artistCard = document.createElement("div");
                artistCard.classList.add("artist-card");
                artistCard.innerHTML = `<img src="${artist.image}" alt="${artist.name}"> <h2>${artist.name}</h2>`;
                container.append(artistCard);
            });
        })
        .catch((error) => console.error(error.message));
}

async function getArtistData(searchQuery) {
    const data = await fetch(
        `https://api.jamendo.com/v3.0/artists/?client_id=ec9b8271&format=jsonpretty&hasimage=true&limit=200&namesearch=${encodeURIComponent(searchQuery)}`,
    );

    if (!data.ok) {
        throw new Error("HTTP Error. Status:", data.status);
    }

    return data.json();
}
