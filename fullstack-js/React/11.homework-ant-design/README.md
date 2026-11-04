# Ant Design

## Description

A React application demonstrating the use of Ant Design components to build a registration form with validation.

The application integrates Ant Design with React Hook Form and TypeScript. Ant Design provides the UI components and form layout, while React Hook Form manages form state, validation and submission. The integration is implemented using `Controller` to connect Ant Design components to React Hook Form.

## Features

- **Ant Design Components:** Build the form interface using Ant Design `Input`, `Input.Password`, `DatePicker`, `Form.Item` and `Button` components.
- **React Hook Form Integration:** Connect Ant Design components to form state and validation using React Hook Form's `Controller`.
- **Form Validation:** Validate required fields, username and password lengths, email and phone number formats, date of birth and password confirmation.
- **Optional Fields:** Allow the phone number and date of birth to be left empty.
- **Date Validation:** Prevent future dates of birth and reject dates more than 120 years in the past.
- **Input Normalization:** Trim surrounding whitespace using the shared `safeTrim` helper.
- **Validation Feedback:** Display field-specific validation messages through Ant Design `Form.Item`.
- **Submission Handling:** Simulate asynchronous form submission and display a loading state while submitting.
- **Phone Number Formatting:** Normalize the phone number before displaying the submitted payload.
- **TypeScript:** Define a shared `FormInputs` interface for form data.

## Installation and Usage

**Prerequisites:** [Node.js](https://nodejs.org/) and npm.

1. Clone the repository:

   ```bash
   git clone https://github.com/604vadym/604vadym.github.io.git
   ```

2. Navigate to the project directory:

   ```bash
   cd 604vadym.github.io/fullstack-js/React/10.homework-formik-yup-react-hook-form
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

[View Live Demo](https://604vadym-github-io-ant-design.vercel.app/)
