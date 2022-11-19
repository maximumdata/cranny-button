'use strict';

const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// used in the module rules and in the stats exclude list
const IMAGE_TYPES = /\.(png|jpe?g|gif|svg)$/i;

module.exports = {
    entry: './src/content.js',
    output: {
        path: path.resolve(__dirname, 'build/'),
        filename: 'content.js'
    },
    stats: {
        all: false,
        errors: true,
        builtAt: true,
        assets: true,
        excludeAssets: [IMAGE_TYPES],
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            },
            // Help webpack in understanding CSS files imported in .js files
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            // Check for images imported in .js files and
            {
                test: IMAGE_TYPES,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'images',
                            name: '[name].[ext]',
                        },
                    },
                ],
            },
        ],
    },
    resolve: { extensions: ["*", ".js", ".jsx"] },
    plugins: [
        // Copy static assets from `public` folder to `build` folder
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: '**/*',
                    context: 'public',
                },
            ],
        }),
        // Extract CSS into separate files
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
    ]
};
