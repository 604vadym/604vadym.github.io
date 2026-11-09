# React Memoization

## Description

A React application demonstrating component and value memoization using React, TypeScript and Vite.

The application performs computationally intensive calculations to count prime numbers and renders a large static table containing 100 rows and 50 columns. It demonstrates how React memoization techniques can prevent unnecessary recalculations, function recreations and component re-renders.

Users can trigger parent component re-renders, execute prime number calculations with custom input values, and interact with the table to observe how `useMemo`, `useCallback` and `React.memo` work together to optimize rendering performance.

## Features

- **useMemo:** Cache the results of computationally intensive prime number calculations and avoid repeating them when unrelated state changes.
- **useCallback:** Memoize event handler functions to preserve their references between renders.
- **React.memo:** Wrap the `HeavyTable` component with `memo` to prevent unnecessary re-renders when its props remain unchanged.
- **Memoized Object References:** Use `useMemo` to preserve the table's style object reference between parent renders.
- **Heavy Calculations:** Count prime numbers up to a user-defined limit, with a default value of 8,888,888.
- **Large Static Table:** Render a table containing 100 rows and 50 columns to demonstrate the effects of component memoization.
- **Parent Re-render Testing:** Trigger parent component re-renders independently of the prime number calculation to observe cached values and memoized components.
- **useRef:** Access the input element directly to retrieve the number entered by the user without maintaining its value in React state.
- **TypeScript:** Define component props and DOM element types.

The project demonstrates how `useMemo`, `useCallback` and `React.memo` work together to reduce unnecessary calculations and component re-renders by preserving values, function references and component output between renders.

## Installation and Usage

**Prerequisites:** [Node.js](https://nodejs.org/) and npm.

1. Clone the repository:

    ```bash
    git clone https://github.com/604vadym/604vadym.github.io.git
    ```

2. Navigate to the project directory:

    ```bash
    cd 604vadym.github.io/fullstack-js/React/11.homework-usememo-usecallback-memo
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

[View Live Demo](https://604vadym-github-io-usememo-usecallb.vercel.app/)
