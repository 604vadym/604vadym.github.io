# Fetching Data with React useEffect and Axios

## Description

A simple React application demonstrating data fetching with the `useEffect` hook and Axios.

The application allows users to enter a post ID and fetch the corresponding post from the JSONPlaceholder API.

- **Data Fetching:** Uses Axios to request post data from the JSONPlaceholder API based on the entered post ID.
- **Loading State:** Displays a loading message while the request is in progress.
- **Error Handling:** Handles failed requests, including 404 errors when a post is not found.
- **Dynamic Requests:** Fetches data when the user clicks the Request button. The `useEffect` hook runs whenever the requested post ID changes.
- **Clear Functionality:** Allows users to clear the input and remove the displayed post.

The project illustrates asynchronous data fetching, React state management, side effects with `useEffect` and error handling using Axios and TypeScript.

## Installation and Usage

**Prerequisites:** [Node.js](https://nodejs.org/) and npm.

1. Clone the repository:

   ```bash
   git clone https://github.com/604vadym/604vadym.github.io.git
   ```

2. Navigate to the project directory:

   ```bash
   cd 604vadym.github.io/fullstack-js/React/05.homework-useeffect-refetching-axios
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

[View Live Demo]()
