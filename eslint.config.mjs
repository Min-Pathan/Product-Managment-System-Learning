import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs}"],
    languageOptions: {
      sourceType: "module",
      ecmaVersion: "latest",
      globals: globals.node,
    },
  },
  {
    files: ["**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: "latest",
      globals: globals.node,
    },
  },
]);
