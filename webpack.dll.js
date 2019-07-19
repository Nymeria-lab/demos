
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
module.exports = {
    entry: {
        "lib_0": [
            "angular",
            'angular-ui-router',
            'angular-touch',
            'angular-animate',
            'oclazyload',
            'angular-moment'
        ],
        "lib_1": [
            'better-scroll',
            'iscroll',
            'moment',
            "sortablejs",
            'vconsole',
            'es6-promise',
            'crypto-js',
            'ng-file-upload'
        ],
        "lib_2": [
            'js-beautify/js',
            "jsonlint-webpack"
        ]
    },
    output: {
        path: __dirname + "/static/resources",
        filename: '[name]_[chunkhash].js',
        library: '[name]_[chunkhash]',
        publicPath: `/static/resources/`
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['css-loader']
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['static'], {
            root: '',
            verbose: true,
            dry: false
        }),
        new webpack.DllPlugin({
            path: './static/resources/manifest_[name].json',
            name: '[name]_[chunkhash]',
            context: __dirname
        }),
        //去除moment中其他地区语言包
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/),
        new CopyWebpackPlugin([
            {from: './node_modules/ace-builds/src-min-noconflict', to: 'lib/ace'},
            {from: './node_modules/jquery/dist/jquery.min.js', to: 'lib'},
            {from: './node_modules/jquery.nicescroll/dist/jquery.nicescroll.min.js', to: 'lib'},
            {from: './node_modules/orgchart/dist/js/jquery.orgchart.js', to: 'lib'}
        ]),
        new AssetsPlugin({
            filename: `./static/resources/assets.dll.json`
        })
    ]
};
