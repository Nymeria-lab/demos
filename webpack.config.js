
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const webpack = require("webpack");
const index_middle = require('./server/middle/index-middle')('');
const DllLib = require("./static/resources/assets.dll");

module.exports = {
    devtool: 'inline-source-map',
    devServer:{
        contentBase: __dirname + "/",
        port: 9000,
        host: '0.0.0.0',
        disableHostCheck: true,
        before: function (app) {
            app.use(['/service'], index_middle);
        }
    },
    stats: {
        children: false
    },
    entry:{
        index: `./source/service/app.pc.js`,
    },
    resolve: {
        extensions: ['.js', '.css', '.sass']
    },
    output: {
        path: __dirname + `/static/service/pc/`,
        filename: "test.js",
        chunkFilename: "[name]-[chunkhash].js",
        publicPath: `/static/service/pc/`
    },
    module: {
        rules: [
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
                    loader: __dirname + '/module-loader/index.js',
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
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }, {
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'fast-sass-loader']
            }, {
                test: /\.(gif|png|jpg|ico|svg)$/,
                loader: 'url-loader?limit=8192&name=resources/images/[hash].[ext]'
            }, {
                test: /\.(eot|woff|svg)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=10000&name=resources/fonts/[hash].[ext]'
            }, {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader?limit=10000&name=resources/fonts/[hash].[ext]&mimetype=application/octet-stream'
            }
        ]
    },
    recordsPath: __dirname + `/node_modules/.cache/webpack/chunks.service.pc.json`,
    performance: {
        maxEntrypointSize: 400000,
        maxAssetSize: 400000
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true
            }),
            new OptimizeCSSAssetsPlugin()
        ],
        splitChunks: {
            cacheGroups: {
                default: false,
                vendors: false,
                common: {
                    chunks: "initial",
                    test: /[\\/]common[\\/]/,
                    minChunks: 1,
                    priority: -10,
                    name: 'common'
                },
                styles: {
                    name: `style`,
                    test: /\.scss|css$/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
        new webpack.NormalModuleReplacementPlugin(/(.*){target}(\.*)/, function (resource) {
            resource.request = resource.request.replace('{target}', 'pc');
        }),
        new CleanWebpackPlugin([
            `static/service/pc`
        ]),
        new webpack['HashedModuleIdsPlugin'](),
        new MiniCssExtractPlugin({
            filename: '[name]-[contenthash].css',
            allChunks: true
        }),
        new AssetsPlugin({
            filename: `./static/resources/assets.service.pc.json`
        })
    ].concat(Object.keys(DllLib).filter(v => v !== '').map(v => {
        return new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require(`./static/resources/manifest_${v}.json`),
        })
    }))

};
