module.exports = {
	env: {
		es2021: true,
		node: true
	},
	extends: ["standard"],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 12,
		sourceType: "module"
	},
	plugins: ["@typescript-eslint"],
	rules: {
		"no-tabs": "off",
		indent: "off",
		quotes: "off",
		"no-mixed-spaces-and-tabs": "off",
		semi: "off",
		"spaced-comment": "off",
		"space-before-function-paren": "off",
		"dot-notation": "off"
	}
};
