import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn", // don't block build
      "@typescript-eslint/no-explicit-any": "off", // allow 'any' for now
      "react/no-unescaped-entities": "off", // allow plain quotes in JSX
      "react-hooks/exhaustive-deps": "warn", // just warn, no error
    },
  },
];

export default eslintConfig;
