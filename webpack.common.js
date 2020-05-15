const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    entry: {
        popup: path.join(__dirname, 'src','popup.ts'),
        background: path.join(__dirname, 'src', 'background.ts'),
        content: path.join(__dirname, 'src', 'content.ts'),
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'js/[name].js',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader', // Creates style nodes from JS strings
                    },
                    {
                        loader: 'css-loader', // Translates CSS into CommonJS
                    },
                    {
                        loader: 'sass-loader', // Compiles Sass to CSS
                    },
                ],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin([
            {from: '**/*', context: 'static/'},
            {from: '**/*.html', context: 'src/'},
            {from: 'manifest.json'},
        ]),
    ],
    resolve: {
        alias: {
            'webextension-polyfill-ts': path.resolve(path.join(__dirname, 'node_modules', 'webextension-polyfill-ts')),
            'webextension-polyfill': path.resolve(path.join(__dirname, 'node_modules', 'webextension-polyfill')),
        },
        modules: [
            path.resolve(__dirname, 'src'),
        ],
        extensions: ['.ts', '.tsx', '.js'],
    },
}