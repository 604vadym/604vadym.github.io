"use strict";

import { getArtistsData } from "./api.js";

const input = document.querySelector(".search-input");
const container = document.querySelector(".artists");
container.innerHTML = "";
let lastSearchQuery = null;
let timeoutId = null;

input.addEventListener("input", handleInput);

function handleInput(e) {
    clearTimeout(timeoutId);
    const searchQuery = e.target.value.trim();

    if (searchQuery.length < 4) {
        lastSearchQuery = null;
        container.innerHTML = "";
        return;
    }

    timeoutId = setTimeout(() => {
        if (lastSearchQuery === searchQuery) return;

        lastSearchQuery = searchQuery;
        getArtistsData(searchQuery)
            .then(({ results }) => {
                container.innerHTML = "";

                const artists = results.filter((artist) => artist.image);

                if (artists.length === 0) {
                    printMsg("No artists found.");
                    return;
                }

                artists.forEach((artist) => {
                    const artistCard = document.createElement("a");
                    const img = document.createElement("img");
                    const header = document.createElement("h2");

                    artistCard.classList.add("artist-card");
                    artistCard.href = `./audio-player/index.html?artistId=${artist.id}`;

                    img.alt = header.textContent = artist.name;
                    img.src = artist.image;

                    artistCard.append(img, header);
                    container.append(artistCard);
                });
            })
            .catch((error) => {
                console.error(error.message);
                printMsg("Error loading artists.");
            });
    }, 1000);

    function printMsg(msg) {
        const header = document.createElement("h2");
        header.innerText = msg;
        container.append(header);
    }
}
