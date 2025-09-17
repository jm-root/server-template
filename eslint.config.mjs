
import globals from "globals";
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

export default [
	{
		languageOptions: {
			ecmaVersion: 2022,
			globals: {
				...globals.node
			},
		},
	},
	{
		...js.configs.recommended,
		files: ["**/*.test.js"],
		rules: {
			"no-unused-vars": "warn"
		},
	},
	{
		...js.configs.recommended,
		files: ["**/packages/*.js"],
		rules: {
			"no-unused-vars": "warn",
			"no-undef": "warn",
		},
	},
	{
		files: ["**/*.ts", "**/*.tsx"],
		languageOptions: {
			parser: tsparser,
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: "module",
			},
		},
		plugins: {
			"@typescript-eslint": tseslint,
		},
		rules: {
			...tseslint.configs.recommended.rules,
			// 项目自定义规则
		},
	},
	// Prettier集成与忽略配置
]
