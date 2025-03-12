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
      // Disable the unused variables error completely
      "@typescript-eslint/no-unused-vars": "off",
      
      // Configure empty object type rule to allow them
      "@typescript-eslint/no-empty-object-type": ["error", {
        allowObjectTypes: true
      }]
    }
  },
  {
    // Add an override specifically for the generate-upload-url file
    files: ["src/features/upload/api/use-generate-upload-url.ts"],
    rules: {
      "@typescript-eslint/no-empty-object-type": "off"
    }
  }
];

export default eslintConfig;