# Unit Testing with Vitest and React Testing Library

## Description

A simple React application demonstrating unit testing of React components using Vitest, React Testing Library, TypeScript and Vite.

The application fetches user data from the JSONPlaceholder API and displays the user's username, city and email address.

The `UserFetcher` component handles loading, successful data retrieval and error states. Its behavior is tested using mocked API responses to avoid making actual network requests during tests.

## Features

- **Testing Environment:** Configure Vitest as the testing framework with the `jsdom` environment.
- **Component Rendering:** Render React components in a simulated DOM using React Testing Library.
- **API Mocking:** Mock the API utility using `vi.mock()` to control its responses during tests.
- **Loading State Testing:** Verify that the loading indicator is displayed while user data is being fetched.
- **Successful Fetch Testing:** Verify that the component displays the retrieved user's username, city and email address.
- **Error Handling Testing:** Verify that an appropriate error message is displayed when the API request fails.
- **Asynchronous Testing:** Use asynchronous queries such as `findByText()` to verify UI updates after asynchronous operations.
- **TypeScript:** Define types for API responses and use typed mocks in tests.

The project demonstrates testing React component behavior under different asynchronous conditions, isolating components from external API dependencies and verifying their rendered output.

## Installation and Usage

**Prerequisites:** [Node.js](https://nodejs.org/) and npm.

1. Clone the repository:

   ```bash
   git clone https://github.com/604vadym/604vadym.github.io.git
   ```

2. Navigate to the project directory:

   ```bash
   cd 604vadym.github.io/fullstack-js/React/09.homework-unit-testing-vitest
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Run the tests:

   ```bash
   npm test
   ```

6. Run the tests in watch mode:

   ```bash
   npm run test:watch
   ```
