# Controlled and Uncontrolled Components. useEffect hook

## Description

A simple React application demonstrating controlled and uncontrolled form components, the `useRef` hook and data fetching with `useEffect`.

- **Controlled Form:** Manages a text input and a checkbox using React's `useState` hook. The text input accepts only numeric values. On submission, it displays the entered numbers and the checkbox status in alert dialogs.
- **Uncontrolled Form:** Uses `useRef` to access the input value directly from the DOM. On submission, it displays the entered message in an alert dialog.
- **Fetch Component:** Uses `useEffect` to fetch photo data from the JSONPlaceholder API when the component mounts. It displays a loading message while fetching, handles errors and renders thumbnails of up to 50 photos when the data is successfully loaded.

## Installation and Usage

**Prerequisites:** [Node.js](https://nodejs.org/) and npm.

1. Clone the repository:

   ```bash
   git clone https://github.com/604vadym/604vadym.github.io.git
   ```

2. Navigate to the project directory:

   ```bash
   cd 604vadym.github.io/fullstack-js/React/03.homework-controlled-uncontrolled-components-useeffect
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL displayed in the terminal.

## Live Demo

[View Live Demo](https://604vadym-github-io-controlled-uncon.vercel.app/)
