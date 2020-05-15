// module.exports = {
//     'env': {
//         'browser': true,
//         'commonjs': true,
//         'es6': true,
//     },
//     'extends': [
//         'eslint:recommended',
//         'plugin:@typescript-eslint/eslint-recommended',
//         'plugin:@typescript-eslint/recommended',
//     ],
//     'globals': {
//         'Atomics': 'readonly',
//         'SharedArrayBuffer': 'readonly',
//     },
//     'parser': '@typescript-eslint/parser',
//     'parserOptions': {
//         'ecmaVersion': 2020,
//         'sourceType': 'module',
//     },
//     'plugins': [
//         '@typescript-eslint',
//     ],
//     'overrides': [
//         {
//             'env': {
//                 'node': true,
//             },
//             'files': ['*.js'],
//             'rules': {
//                 '@typescript-eslint/no-var-requires': ['off']
//             }
//         }
//     ],
//     'rules': {
//         'comma-dangle': [
//             'error',
//             'always-multiline',
//         ],
//         'indent': [
//             'error',
//             4,
//         ],
//         'linebreak-style': [
//             'error',
//             'unix',
//         ],
//         'no-empty-function': [
//             'error',
//             {
//                 'allow': ['constructors']
//             }
//         ],
//         'quotes': [
//             'error',
//             'single',
//         ],
//         'semi': [
//             'error',
//             'never',
//         ],
//     },
// }