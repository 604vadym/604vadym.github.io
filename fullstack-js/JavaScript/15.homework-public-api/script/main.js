"use strict";

import { getArtistsData } from "./api.js";

const searchInput = document.querySelector(".search-input");
const container = document.querySelector(".artists");
let lastSearchQuery = null;
let timeoutId = null;

searchInput.addEventListener("input", handleInput);
window.addEventListener("pageshow", handlePageshow);

function handleInput() {
    clearTimeout(timeoutId);
    const searchQuery = searchInput.value.trim();

    if (searchQuery.length < 4) {
        lastSearchQuery = null;
        container.innerHTML = "";
        return;
    }

    timeoutId = setTimeout(() => {
        if (lastSearchQuery === searchQuery) return;

        searchArtists(searchQuery).then((artists) =>
            artists.forEach(renderArtist),
        );
    }, 1000);
}

function handlePageshow() {
    const searchQuery = searchInput.value.trim();

    if (searchQuery && container.children.length === 0) {
        searchArtists(searchQuery).then((artists) =>
            artists.forEach(renderArtist),
        );
    }
}

async function searchArtists(query) {
    let artists = [];
    try {
        const { results } = await getArtistsData(query);

        lastSearchQuery = query;
        container.innerHTML = "";
        artists = results.filter((artist) => artist.image);

        if (artists.length === 0) {
            printMsg("No artists found.");
        }
    } catch (error) {
        console.error(error.message);
        printMsg("Error loading artists.");
    }
    return artists;

    function printMsg(msg) {
        const h2 = document.createElement("h2");
        h2.textContent = msg;
        container.append(h2);
    }
}

function renderArtist(artist) {
    const artistCard = document.createElement("a");
    const img = document.createElement("img");
    const h2 = document.createElement("h2");

    artistCard.classList.add("artist-card");
    artistCard.href =
        `./audio-player/index.html?artistId=${artist.id}` +
        `&shareurl=${encodeURIComponent(artist.shareurl)}`;

    img.src = artist.image;
    img.alt = artist.name;
    h2.textContent = artist.name;

    artistCard.append(img, h2);
    container.append(artistCard);
}
