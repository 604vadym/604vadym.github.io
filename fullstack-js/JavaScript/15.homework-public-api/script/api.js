const URL_BASE = "https://api.jamendo.com/v3.0";
const CLIENT_ID = "ec9b8271";
const ERROR_MSG = "HTTP Error. Status:";
const currentDate = new Date();

export async function getArtistsData(searchQuery) {
    const response = await fetch(
        `${URL_BASE}/artists/?client_id=${CLIENT_ID}` +
            `&format=jsonpretty` +
            `&order=name` +
            `&hasimage=true` +
            `&limit=200` +
            `&namesearch=${encodeURIComponent(searchQuery)}`,
    );

    if (!response.ok) {
        throw new Error(`${ERROR_MSG} ${response.status}`);
    }

    return response.json();
}

export async function getArtistTracks(artisId) {
    const response = await fetch(
        `${URL_BASE}/artists/tracks/?client_id=${CLIENT_ID}` +
            `&format=jsonpretty` +
            `&id=${artisId}` +
            `&album_datebetween=0000-00-00_${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, `0`)}-${currentDate.getDate().toString().padStart(2, `0`)}`,
    );

    if (!response.ok) {
        throw new Error(`${ERROR_MSG} ${response.status}`);
    }

    return response.json();
}
