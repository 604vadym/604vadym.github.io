# Stateful and Stateless Components

## Description

A simple React application demonstrating the differences between stateful and stateless components and how they handle user interactions.

- **Stateless Component:** Receives button text and a click handler through props. When clicked, the button invokes the callback passed from the parent component, displaying the current date and time in an alert dialog.
- **Stateful Component:** Manages its own state using React's `useState` hook without receiving props. Each click changes the button's background color in a cycle: red → green → blue → red. The button text updates to reflect the current color.

## Installation and Usage

**Prerequisites:** [Node.js](https://nodejs.org/) and npm.

1. Clone the repository:

   ```bash
   git clone https://github.com/604vadym/604vadym.github.io.git
   ```

2. Navigate to the project directory:

   ```bash
   cd 604vadym.github.io/fullstack-js/React/02.homework-stateful-stateless-components
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

[View Live Demo](https://604vadym-github-io-stateful-statele.vercel.app/)
