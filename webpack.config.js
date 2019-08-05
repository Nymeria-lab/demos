'use strict';

const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const index_middle = require('./server/middle/index-middle')('');
const DllLib = require("./static/resources/assets.dll");
module.exports = {
    entry: {
        index: `./apps/pc.js`
    },
    output: {
        path: __dirname + `/static/apps/`,
        filename: "[name]-[chunkhash].js",
        chunkFilename: "[name]-[chunkhash].js",
        publicPath: `/static/apps/`
    },
    devServer: {
        contentBase: __dirname + "/",
        port: 9010,
        before: function (app) {
            app.use(['apps'], index_middle);
        }
    },
    module: {
        "rules": [
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        interpolate: true,
                        attrs: ['img:src']
                    }
                }]
            }, {
                test: /module\.json$/,
                exclude: /(node_modules\/(?!webpack-dev-server).*|static)/,
                type: "javascript/auto",
                use: [{
                    loader: __dirname + '/hcm-module-loader/index.js',
                    options: {
                        target: 'apps'
                    }
                }]
            }, {
                test: /\.js$/,
                exclude: /(node_modules\/(?!webpack-dev-server).*|static)/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true
                    }
                }]
            }, {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
            }, {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'fast-sass-loader']
            }, {
                test: /\.(gif|png|jpg|ico|svg)$/,
                loader: 'url-loader?limit=8192&name=resources/images/[hash].[ext]'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.css', '.sass']
    },
    plugins: [
        new CleanWebpackPlugin([
        `static/apps`
        ]),
        new webpack['HashedModuleIdsPlugin'](),
        new MiniCssExtractPlugin({
            filename: '[name]-[contenthash].css',
            allChunks: true
        }),
        new AssetsPlugin({
            filename: `./static/resources/assets.apps.json`
        }),
    ].concat(Object.keys(DllLib).filter(v => v !== '').map(v => {
        return new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require(`./static/resources/manifest_${v}.json`),
        })
    }))
};