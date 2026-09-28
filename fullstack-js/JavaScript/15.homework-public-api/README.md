# Jamendo Artist Search & Music Player

A JavaScript application that combines live artist search using the Jamendo API with a **custom-built slider and audio player**, originally developed as an independent project in [Showcase App — Slider / Audio Player / Shop](../11-homework-fsm-engine-slider-showcase-player-oop-prototypes-classes/).

## Demo

[Open the project on GitHub Pages](https://604vadym.github.io/fullstack-js/JavaScript/15.homework-public-api/index.html)

## Features

- **Live Search** — automatically searches for artists as the user types, with a debounce delay to reduce unnecessary API requests.
- **Artist Search** — displays matching artists with available images.
- **Dynamic Player Data** — loads the selected artist's tracks and album artwork from the Jamendo API.
- **Music Playback** — plays tracks directly from Jamendo using the existing audio player.
- **Artist Links** — provides a link to the selected artist's Jamendo page.

## Architecture

The application integrates the Jamendo API into a **self-implemented slider and audio player**, built from scratch using object-oriented JavaScript and ES6 classes.

The player combines several components:

- **Slider** — navigates between album covers.
- **AudioPlayer** — manages audio playback and track selection.
- **AudioDeckView** — handles the audio player's visual representation.
- **Shop** — provides a link to the selected artist's Jamendo page.
- **ShowcaseApp** — coordinates the components.

The player uses a component-based architecture with event-driven communication, state management and dedicated managers.

### Reusability

The existing slider and audio player components were reused **without modifying their internal logic**.

Integrating the Jamendo API required adapting the data supplied to the player, including:

- Album artwork and image URLs.
- Audio stream URLs and track metadata.
- The Shop link, pointing to the selected artist's Jamendo page.

The existing components work with these API-provided resources through their original interfaces. Integrating the external API required only minimal changes to the existing code, demonstrating the reusability of the original implementation.

## Technologies

- Vanilla JavaScript (ES6+)
- HTML5 / CSS3
- Fetch API
- Jamendo API

## Purpose

An educational project focused on asynchronous JavaScript, working with a public API, live search and integrating external data into a custom-built application architecture.
