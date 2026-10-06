import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        ignores: ["dist/**/*", "node_modules/**/*", "webpack.config.js"],
    },

    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        ...js.configs.recommended,
        languageOptions: {
            globals: {
                ...globals.browser,
                $: "readonly",
                jQuery: "readonly",
            },
        },
    },

    ...tseslint.configs.recommended.map((config) => ({
        ...config,
        rules: {
            ...config.rules,
            "@typescript-eslint/no-explicit-any": "off",
        },
    })),
]);
