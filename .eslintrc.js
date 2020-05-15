module.exports = {
    'env': {
        'browser': true,
        'commonjs': true,
        'es6': true,
    },
    'extends': [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
    ],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly',
    },
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 2020,
        'sourceType': 'module',
    },
    'plugins': [
        '@typescript-eslint',
    ],
    'rules': {
        'comma-dangle':[
            'error',
            'always-multiline',
        ],
        'indent': [
            'error',
            4,
        ],
        'linebreak-style': [
            'error',
            'unix',
        ],
        'no-empty-function':
            ["error",
            { "allow": ["constructors"] }
        ],
        'sort-imports': [
            'error',
        ],
        'quotes': [
            'error',
            'single',
        ],
        'semi': [
            'error',
            'never',
        ],
    },
}