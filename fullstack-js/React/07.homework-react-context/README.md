# React Context

## Description

A simple React application demonstrating state sharing between components using React Context API, React, TypeScript and Vite.

The application displays a list of users with their names, ages and genders. The visual appearance of the page and user cards depends on the theme provided through context.

## Implemented Features

- **Context Creation:** Create a theme context using `createContext`.
- **Context Provider:** Provide the application theme through `ThemeContext.Provider`.
- **Context Consumption:** Access the theme in `UsersPage` and `UserCard` using the `useContext` hook.
- **Dynamic Styling:** Apply different background colors depending on the current theme.
- **Component Composition:** Separate the user list and individual user cards into reusable components.
- **TypeScript:** Define types for the theme and user data.

The project demonstrates sharing values across a React component tree without prop drilling, using Context API to manage shared configuration and applying conditional styling based on context values.

## Installation and Usage

**Prerequisites:** [Node.js](https://nodejs.org/) and npm.

1. Clone the repository:

   ```bash
   git clone https://github.com/604vadym/604vadym.github.io.git
   ```

2. Navigate to the project directory:

   ```bash
   cd 604vadym.github.io/fullstack-js/React/07.homework-react-context
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

[View Live Demo](https://604vadym-github-io-react-context.vercel.app/)
