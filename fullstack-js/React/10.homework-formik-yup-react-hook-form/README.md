# Formik, Yup & React Hook Form

## Description

A React application demonstrating form handling and validation using Formik, Yup, React Hook Form, TypeScript and Vite.

The application renders two versions of the same user registration form: one implemented with Formik & Yup and the other with React Hook Form. Both forms collect a username, email address, optional phone number, optional date of birth, password and password confirmation.

The project provides a practical comparison of two form-management approaches by implementing equivalent fields, validation rules and submission behavior with each library.

## Features

- **Formik & Yup:** Manage form state and validation using Formik together with a Yup validation schema created with `Yup.object().shape()`.
- **React Hook Form:** Manage form registration, validation and submission using `useForm`, `register` and `handleSubmit`.
- **Form Validation:** Validate required fields, username and password length, email and phone number formats, date of birth and password confirmation.
- **Optional Fields:** Allow the phone number and date of birth to be left empty.
- **Date Validation:** Prevent future dates of birth and reject dates more than 120 years in the past.
- **Password Confirmation:** Ensure that the confirmation field matches the entered password.
- **Input Normalization:** Trim leading and trailing whitespace using a shared `safeTrim` helper.
- **Validation Feedback:** Display field-specific error messages and expose invalid states through `aria-invalid` and `aria-describedby` attributes.
- **Submission Handling:** Simulate asynchronous form submission with a one-second delay and disable the submit button while submitting.
- **Phone Number Formatting:** Normalize the optional phone number before submission by removing formatting characters while preserving digits and the leading plus sign.
- **TypeScript:** Define a shared `FormInputs` interface for the form data.

The project demonstrates two approaches to form management and validation in React: schema-based validation with Formik & Yup and field-level validation with React Hook Form. Both implementations share the same data type, input-normalization helper and visual styles.

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

[View Live Demo](https://604vadym-github-io-formik-yup-react.vercel.app/)
