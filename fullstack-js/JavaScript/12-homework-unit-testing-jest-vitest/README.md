# Unit Testing with Jest & Vitest

This project is a comprehensive unit testing workspace demonstrating test suites built with **Jest** and **Vitest**. It includes dedicated test code, code coverage reporting integrated into a single dashboard, a hosted view and an automated meta-testing setup to validate test correctness.

---

## 📂 Project Structure

```text
├── project-jest/          # Test suite implemented using Jest & Babel (ES Modules)
├── project-vitest/        # Test suite implemented using Vitest with happy-dom
├── test-check/            # Meta-testing suite designed to validate Jest & Vitest implementations
├── tests-coverage/        # Centralised folder storing raw coverage artifacts from both frameworks
├── styles/                # Custom CSS styles for the centralised coverage dashboard
├── index.html             # The landing page for GitHub Pages with navigation to both reports
└── README.md              # Root documentation (this file)
```

---

## 🛠️ Tech Stack Overview

- **Runtime:** Node.js (ES Modules enabled via `"type": "module"`)
- **Testing Frameworks:** Jest, Vitest
- **DOM Simulation:** Happy DOM
- **Coverage Engine:** @vitest/coverage-v8 & Jest Native Coverage
- **Transpiler:** Babel (for Jest compatibility)
- **Deployment:** GitHub Pages (Static hosting for aggregated test reports)

---

## 🚀 How to Navigate and Run

Each project is self-contained and has its own `package.json` and dedicated instructions. To review, install, or run tests for a specific part of the assignment, navigate into its respective folder:

### 1. Jest Project

Go to the folder to install dependencies and run standard Jest tests:

```bash
cd fullstack-js/JavaScript/12-homework-unit-testing-jest-vitest/project-jest
```

_(See the local **[README.md](./project-jest/README.md)** inside that directory for detailed scripts)._

### 2. Vitest Project

Go to the folder to run fast Vitest execution and check test coverage metrics:

```bash
cd fullstack-js/JavaScript/12-homework-unit-testing-jest-vitest/project-vitest
```

_(See the local **[README.md](./project-vitest/README.md)** inside that directory for detailed coverage commands)._

### 3. Meta-Testing

To evaluate the tests using the validation scripts, navigate to the checker folder:

```bash
cd fullstack-js/JavaScript/12-homework-unit-testing-jest-vitest/test-check
```

_(See the local **[README.md](./test-check/README.md)** inside that directory for detailed scripts)._

---

## 📊 Centralised Dashboard

The generated testing reports is compiled inside the `tests-coverage/` directory.

👉 **[Launch Dashboard with test coverage reports](https://604vadym.github.io/fullstack-js/JavaScript/12-homework-unit-testing-jest-vitest/index.html)**
