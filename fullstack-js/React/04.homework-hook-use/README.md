# Fetching Data with React Hook use

## Description

A simple React application demonstrating data fetching with React's `use` API, `Suspense` and error boundaries.

The application simulates a 2222 ms delay before each API request and demonstrates two scenarios:

- **Successful Fetch:** Fetches photo data from the JSONPlaceholder API and displays thumbnails of the first 10 photos. The `use` API reads the promise passed to the component, while `Suspense` displays a loading message until the data is available.
- **Failed Fetch:** Requests data from an incorrect API endpoint to demonstrate error handling. The `ErrorBoundary` component displays an error message when the request fails.

The project illustrates how React handles asynchronous data loading, loading states and errors using `Suspense` and `ErrorBoundary`.

## Installation and Usage

**Prerequisites:** [Node.js](https://nodejs.org/) and npm.

1. Clone the repository:

   ```bash
   git clone https://github.com/604vadym/604vadym.github.io.git
   ```

2. Navigate to the project directory:

   ```bash
   cd 604vadym.github.io/fullstack-js/React/04.homework-hook-use
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

[View Live Demo](https://604vadym-github-io-hook-use.vercel.app/)
