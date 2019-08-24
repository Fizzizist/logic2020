const path = require('path');
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');

module.exports = {
    context: __dirname,

    target: 'web',

    entry: './logix/assets/logix/index.jsx',

    output: {
        path: path.resolve('./logix/static/logix/bundles/'),
        filename: 'logix.bundle.js',
    },

    plugins: [
        new BundleTracker({filename: './webpack-stats.json'}),
    ],
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['@babel/react'],
                }
            }
        ]
    },
    resolve: {
        modules: ['node_modules'],
        extensions: ['*', '.js', '.jsx']
    }
};