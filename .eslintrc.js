module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: ["standard"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 12,
		sourceType: "module",
	},
	plugins: ["@typescript-eslint"],
	rules: {
		"no-tabs": "off",
		"no-console": "off",
		indent: "off",
		quotes: "off",
		"comma-dangle": "off",
		"no-mixed-spaces-and-tabs": "off",
		semi: "off",
		"promise/param-names": "off",
		"spaced-comment": "off",
		"space-before-function-paren": "off",
		"no-eval": "warn",
		"dot-notation": "off",
	},
};
