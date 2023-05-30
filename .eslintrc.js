module.exports = {
	root: true,
	env: {
		browser: true,
		node: true
	},
	parser: '@typescript-eslint/parser',
	plugins: [
		'@typescript-eslint',
		'react',
		'react-hooks',
		'jsx-a11y'
	],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react/recommended',
		'plugin:react-hooks/recommended',
		'plugin:jsx-a11y/recommended',
		'@selvklart/eslint-config'
	],
	ignorePatterns: [
		'.parcel-cache/**/*.*',
		'dist/**/*.*',
		'node_modules/**/*.*'
	],
	rules: {
		// Disable js-rule turned on by @selvklart/eslint-config that
		// conflicts with typescript. (It is superseded by a similar rule
		// that does support typescript)
		'no-unused-vars': 'off',
		// The React global is not needed after react 17
		'react/react-in-jsx-scope': 'off'
	},
	settings: {
		react: {
			version: '18'
		}
	}
};
