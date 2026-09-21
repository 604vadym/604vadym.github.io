# Unit Testing with Jest & Vitest

This repository contains a comprehensive suite of unit tests split across different projects using two major frameworks: **Jest** and **Vitest**. It also includes a meta-testing tool to validate the correctness of the test suites.

---

## 📂 Repository Structure

The homework is divided into three separate directories:

- **`project-jest`** — Test suite implemented using **Jest** and **Babel** for ES Modules support.
- **`project-vitest`** — Test suite implemented using **Vitest** with configured code coverage (`v8`) and `happy-dom` setup.
- **`test-check`** — A **meta-testing sub-project**. It runs automated checks against both the Jest and Vitest test suites to verify their implementation and correctness.

---

## 🛠️ Tech Stack Overview

- **Runtime:** Node.js (ES Modules enabled via `"type": "module"`)
- **Testing Frameworks:** Jest, Vitest
- **DOM Simulation:** Happy DOM
- **Coverage Tool:** @vitest/coverage-v8
- **Transpiler:** Babel (for Jest compatibility)

---

## 🚀 How to Navigate and Run

Each project is self-contained and has its own `package.json` and dedicated instructions. To review, install, or run tests for a specific part of the assignment, navigate into its respective folder:

### 1. Jest Project

Go to the folder to install dependencies and run standard Jest tests:

```bash
cd fullstack-js/JavaScript/12-homework-unit-testing-jest-vitest/project-jest
```

_(See the local `README.md` inside that directory for detailed scripts)._

### 2. Vitest Project

Go to the folder to run fast Vitest execution and check test coverage metrics:

```bash
cd fullstack-js/JavaScript/12-homework-unit-testing-jest-vitest/project-vitest
```

_(See the local `README.md` inside that directory for detailed coverage commands)._

### 3. Meta-Testing

To evaluate the tests using the validation scripts, navigate to the checker folder:

```bash
cd fullstack-js/JavaScript/12-homework-unit-testing-jest-vitest/test-check
```

_(See the local `README.md` inside that directory for detailed scripts)._
