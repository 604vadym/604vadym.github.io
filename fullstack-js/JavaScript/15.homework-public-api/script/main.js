"use strict";

import { getArtistsData } from "./api.js";

const searchInput = document.querySelector(".search-input");
const container = document.querySelector(".artists");
container.innerHTML = "";
let lastSearchQuery = null;
let timeoutId = null;

searchInput.addEventListener("input", handleInput);
window.addEventListener("pageshow", handlePageshow);

function handleInput(e) {
    clearTimeout(timeoutId);
    const searchQuery = searchInput.value.trim();

    if (searchQuery.length < 4) {
        lastSearchQuery = null;
        container.innerHTML = "";
        return;
    }

    timeoutId = setTimeout(() => {
        if (lastSearchQuery === searchQuery) return;

        searchArtists(searchQuery);
    }, 1000);
}

function handlePageshow(e) {
    const searchQuery = searchInput.value.trim();

    if (searchQuery && container.children.length === 0) {
        searchArtists(searchQuery);
    }
}

async function searchArtists(query) {
    lastSearchQuery = query;

    try {
        const { results } = await getArtistsData(query);

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
            artistCard.href =
                `./audio-player/index.html?artistId=${artist.id}` +
                `&shareurl=${encodeURIComponent(artist.shareurl)}`;

            img.alt = header.textContent = artist.name;
            img.src = artist.image;

            artistCard.append(img, header);
            container.append(artistCard);
        });
    } catch (error) {
        console.error(error.message);
        printMsg("Error loading artists.");
    }

    function printMsg(msg) {
        const header = document.createElement("h2");
        header.innerText = msg;
        container.append(header);
    }
}
