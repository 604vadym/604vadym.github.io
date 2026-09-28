"use strict";

const input = document.querySelector(".search-input");
const container = document.querySelector(".artists");
container.innerHTML = "";
let timeoutId = null;

input.addEventListener("input", handleInput);

function handleInput(e) {
    clearTimeout(timeoutId);
    const searchQuery = e.target.value.trim();

    if (searchQuery.length < 4) {
        container.innerHTML = "";
        return;
    }

    timeoutId = setTimeout(() => {
        getArtistsData(searchQuery)
            .then(({ results }) => {
                container.innerHTML = "";

                const artists = results.filter((artist) => artist.image);

                if (artists.length === 0) {
                    const header = document.createElement("h2");
                    header.innerText = "No artists found.";
                    container.append(header);
                    return;
                }

                artists.forEach((artist) => {
                    const artistCard = document.createElement("div");
                    const img = document.createElement("img");
                    const header = document.createElement("h2");

                    artistCard.classList.add("artist-card");
                    img.alt = header.textContent = artist.name;
                    img.src = artist.image;

                    artistCard.append(img);
                    artistCard.append(header);
                    container.append(artistCard);
                });
            })
            .catch((error) => console.error(error.message));
    }, 1000);
}

async function getArtistsData(searchQuery) {
    const response = await fetch(
        `https://api.jamendo.com/v3.0/artists/?client_id=ec9b8271&format=jsonpretty&hasimage=true&limit=200&namesearch=${encodeURIComponent(searchQuery)}`,
    );

    if (!response.ok) {
        throw new Error(`HTTP Error. Status: ${response.status}`);
    }

    return response.json();
}
