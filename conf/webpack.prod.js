const merge = require('webpack-merge')
const {project_base} = require('./project-base')
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
                src: project_base('./dist'),
                dist: '/',
            },
        ],
        path: project_base(),
    })
)
