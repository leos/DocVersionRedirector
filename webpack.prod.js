const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const ZipPlugin = require('zip-webpack-plugin')

module.exports = merge(common, {
    mode: 'production',
    optimization: {
        splitChunks: {
            name: false,
        },
    },
})

module.exports.plugins.push(
    new ZipPlugin({
        filename: 'dist.zip',
        entries: [
            {
                src: path.join(__dirname, './dist'),
                dist: '/',
            },
        ],
        path: path.join(__dirname),
    })
)
