/**
 * Created by hou on 2017/3/28.
 */
const path = require('path');
const config = {
    context: __dirname,
    entry: '../src/index.js',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/dist',
    },
    devServer: {
        inline: true
    }
};
module.exports = config;