
module.exports = {
    entry: {
        "lib_0": [
            "angular",
            'angular-ui-router',
            'angular-touch',
            'angular-animate',
            'oclazyload',
            'angular-moment'
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
    }
};
