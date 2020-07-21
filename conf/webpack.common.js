const {project_base} = require('./project-base')

const CopyWebpackPlugin = require('copy-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        popup: project_base('src', 'popup.ts'),
        background: project_base('src', 'background.ts'),
        content: project_base('src', 'content.ts'),
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 5,
        },
    },
    output: {
        path: project_base('dist'),
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
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: ['!icons/*', '!**/*.{css,html,json}'],
        }),
        new CopyWebpackPlugin({
            patterns: [
            {
                from: '**/*',
                context: 'static/',
            },
        ]}),
        new CopyWebpackPlugin({
            patterns: [
            {
                from: 'manifest.json',
                transform: function (content) {
                    // generates the manifest file using the package.json informations
                    return Buffer.from(
                        JSON.stringify({
                            description: process.env.npm_package_description,
                            version: process.env.npm_package_version,
                            ...JSON.parse(content.toString()),
                        })
                    )
                },
            },
        ]}),
        new HtmlWebpackPlugin({
            chunks: ['background'],
            filename: 'background.html',
            templateContent: '',
        }),
        new HtmlWebpackPlugin({
            chunks: ['popup'],
            filename: 'popup.html',
            inject: 'body',
            template: 'src/popup.html',
        }),
    ],
    resolve: {
        alias: {
            'webextension-polyfill-ts': project_base('node_modules', 'webextension-polyfill-ts'),
            'webextension-polyfill': project_base('node_modules', 'webextension-polyfill'),
        },
        modules: [project_base('src')],
        extensions: ['.ts', '.tsx', '.js'],
    },
}
