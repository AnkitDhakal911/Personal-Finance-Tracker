import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigAsPlugin } from "@eslint/compat";

export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"], languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  fixupConfigAsPlugin(pluginReactConfig),
  {
    rules: {
      // Your custom rules here
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "no-unused-vars": "warn",
    },
  },
]; 