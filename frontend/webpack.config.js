const webpack = require('webpack'); //to access built-in plugins
const path = require('path');

const config = {
    context: path.resolve(__dirname, './app'),
    entry: {
        app: ['whatwg-fetch', './index.js'],
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                 test: /\.js$/,
                 use: [{
                     loader: 'babel-loader?presets[]=es2015',
                     // options: { presets: ['es2015'] }
                 }],
            },
            {
                test: /\.(sass|scss)$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                use: ["url-loader"]
            },
            {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader"
            }, {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        mimetype: 'application/octet-stream'
                    }
                }],

            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                use: ["file-loader"]
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 10000,
                        mimetype: 'image/svg+xml'
                    }
                }],
            },
            {
                test: /\.html$/,
                use: [{loader: 'mustache-loader'}],
            }
        ]
    },
    plugins: [
        new webpack.LoaderOptionsPlugin({
            debug: true
        })
    ],

};

module.exports = config;