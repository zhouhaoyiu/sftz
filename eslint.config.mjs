import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import { vueTsConfigs, withVueTs } from "@vue/eslint-config-typescript";
import pluginVue from "eslint-plugin-vue";

export default withVueTs(
  {
    ignores: [
      "dist/**",
      "auto-imports.d.ts",
      "components.d.ts",
      "src/auto-imports.d.ts",
      "src/components.d.ts",
    ],
  },
  pluginVue.configs["flat/essential"],
  vueTsConfigs.recommended,
  {
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { caughtErrors: "none" }],
      "prefer-const": "off",
    },
  },
  {
    files: ["**/*.cjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  skipFormatting,
);
