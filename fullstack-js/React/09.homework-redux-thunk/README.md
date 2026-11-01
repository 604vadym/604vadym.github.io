# Redux Thunk

## Description

A simple React application demonstrating asynchronous state management using Redux Toolkit, Redux Thunk, React, TypeScript and Vite.

The application fetches user data from the JSONPlaceholder API and displays the retrieved information, including the user's username, name, address, email, website and phone number.

Asynchronous data fetching is implemented using `createAsyncThunk` from Redux Toolkit. The application manages different request states, including loading, success and failure, through Redux reducers.

Users can also switch between light and dark themes using the `ThemeToggler` component. The theme state is managed through a centralised Redux store and shared across the component tree using React-Redux.

## Features

- **Store Configuration:** Set up the Redux store using `configureStore` from Redux Toolkit.
- **Slice Creation:** Define separate theme and user slices using `createSlice`.
- **Asynchronous Actions:** Fetch user data from the JSONPlaceholder API using `createAsyncThunk`.
- **Request Lifecycle Management:** Handle asynchronous request states using `pending`, `fulfilled` and `rejected` action handlers.
- **State Management:** Manage user data, request status, errors and application theme through a centralised Redux store.
- **API Utility:** Implement a reusable generic `fetchData` function for making HTTP requests and handling unsuccessful responses.
- **State Selection:** Access Redux state using selectors through a custom typed `useAppSelector` hook.
- **State Updates:** Dispatch Redux actions using a custom typed `useAppDispatch` hook.
- **User Data Display:** Display the retrieved user information using the `UserCard` component.
- **User Greeting:** Display a greeting based on the fetched user's username using the `UserGreeting` component.
- **Theme Switching:** Toggle between light and dark themes using the `ThemeToggler` component and the `toggleTheme` action.
- **Dynamic Styling:** Apply different styles to the page, user card and greeting depending on the currently selected theme.
- **TypeScript:** Define interfaces and types for API data, application theme, Redux store state and dispatch.

The project demonstrates asynchronous state management with Redux Toolkit, including API requests, request lifecycle handling, error management and accessing shared application state from different components without prop drilling.

## Installation and Usage

**Prerequisites:** [Node.js](https://nodejs.org/) and npm.

1. Clone the repository:

   ```bash
   git clone https://github.com/604vadym/604vadym.github.io.git
   ```

2. Navigate to the project directory:

   ```bash
   cd 604vadym.github.io/fullstack-js/React/09.homework-redux-thunk
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

[View Live Demo](https://604vadym-github-io-redux-thunk.vercel.app/)
