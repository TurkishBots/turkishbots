module.exports = {
	env: {
		commonjs: true,
		es2021: true,
		node: true,
	},
	extends: ["standard"],
	parserOptions: {
		ecmaVersion: "latest",
	},
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
	},
};
