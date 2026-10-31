# Redux Toolkit

## Description

A simple React application demonstrating global state management using Redux Toolkit, React, TypeScript and Vite.

The application displays a list of users with their names, ages and genders. The visual appearance of the page and user cards depends on the currently selected theme.

Users can switch between light and dark themes using the `ThemeToggler` component. The theme state is managed through a Redux store configured with `configureStore` and shared across the component tree using React-Redux.

## Features

- **Store Configuration:** Set up the Redux store using `configureStore` from Redux Toolkit.
- **Slice Creation:** Define the theme state and its reducer logic using `createSlice`.
- **State Management:** Manage the application theme through a centralised Redux store.
- **State Selection:** Access the current theme using `useSelector` through a custom typed `useAppSelector` hook.
- **State Updates:** Dispatch actions using `useDispatch` through a custom typed `useAppDispatch` hook.
- **Theme Switching:** Toggle between light and dark themes using the `ThemeToggler` component and the `toggleTheme` action.
- **Dynamic Styling:** Apply different styles to the page and user cards depending on the currently selected theme.
- **TypeScript:** Define types for the theme, Redux store state and dispatch.

The project demonstrates centralised state management using Redux Toolkit, handling state updates through dispatched actions and accessing shared state from different components without prop drilling.

## Installation and Usage

**Prerequisites:** [Node.js](https://nodejs.org/) and npm.

1. Clone the repository:

   ```bash
   git clone https://github.com/604vadym/604vadym.github.io.git
   ```

2. Navigate to the project directory:

   ```bash
   cd 604vadym.github.io/fullstack-js/React/08.homework-redux-toolkit
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

[View Live Demo](https://604vadym-github-io-redux-toolkit-th.vercel.app/)
