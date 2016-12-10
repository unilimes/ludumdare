var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        app: './sources/main.js'
    },
    output: {
        path: './public',
        filename: 'bundle/[name].js'
    },
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                include: /sources/,
                exclude: /(node_modules|bower_components)/,
                loader: "jshint-loader"
            }
        ],
        loaders: [
            {
                test: /\.html$/,
                include: /sources/,
                exclude: /(node_modules|bower_components)/,
                loader: 'html-loader',
                query: {
                    minimize: true
                }
            },
            {
                test: /\.js$/,
                include: /sources/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: [
                        "es2015"
                    ],
                    plugins: [
                        "transform-class-properties"
                    ]
                }
            },
            {
                test: /\.scss$/,
                include: /sources/,
                exclude: /(node_modules|bower_components)/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.json$/,
                include: /sources/,
                exclude: /(node_modules|bower_components)/,
                loader: 'json-loader'
            },
            {
                test: /\.(jpe?g|png|bmp|gif|svg)$/,
                include: /sources/,
                exclude: /(node_modules|bower_components)/,
                loader: 'file-loader',
                query: {
                    name: 'resources/[name].[ext]'
                }
            },
            {
                test: /\.glsl$/,
                include: /sources/,
                exclude: /(node_modules|bower_components)/,
                loader: 'shader-loader'
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        //new webpack.optimize.CommonsChunkPlugin('bundle/common.js'),
        //new webpack.optimize.DedupePlugin(),
        //new webpack.optimize.UglifyJsPlugin({
        //    mangle: {
        //        except: ['$super', '$', 'exports', 'require']
        //    },
        //    compress: {
        //        warnings: false
        //    },
        //    output: {
        //        comments: false
        //    }
        //}),
        //new webpack.optimize.AggressiveMergingPlugin()
    ],
    jshint: {
        camelcase: true,
        emitErrors: true,
        failOnHint: true,
        esnext: 'esversion: 6'
    },
    devtool: [
        'eval',
        'source-map'
    ],
    devServer: {
        host: '127.0.0.1',
        port: 3000,
        hot: true,
        inline: true,
        contentBase: './public'
    }
};
