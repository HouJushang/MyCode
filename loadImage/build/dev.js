/**
 * Created by hou on 2017/3/28.
 */
// var WebpackDevServer = require("webpack-dev-server");
// const Webpack = require("webpack");
// const webpackConfig = require("./webpack.config");
//
// const compiler = Webpack(webpackConfig);
//
//
// const server = new WebpackDevServer(compiler, {
//     stats: {
//         colors: true
//     },
//     publicPath: "/assets/",
//     hot: true
// });
// server.listen(8080, "127.0.0.1", function() {
//     console.log("Starting server on http://localhost:8080");
// });

var path = require('path') // 使用 NodeJS 自带的文件路径工具
var express = require('express') // 使用 express
var webpack = require('webpack') // 使用 webpack
var opn = require('opn') // 一个可以强制打开浏览器并跳转到指定 url 的插件
var webpackConfig = require('./webpack.dev.conf') // 使用 dev 环境的 webpack 配置
var config = require('./config')

var port = config.dev.port || '8080'

/* 启动 webpack-dev-middleware，将 编译后的文件暂存到内存中 */
var devMiddleware = require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
        colors: true,
        chunks: false
    }
})

/* 启动 webpack-hot-middleware，也就是我们常说的 Hot-reload */
var hotMiddleware = require('webpack-hot-middleware')(compiler)

/* 当 html-webpack-plugin 模板更新的时候强制刷新页面 */
compiler.plugin('compilation', function (compilation) {
    compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
        hotMiddleware.publish({ action: 'reload' })
        cb()
    })
})

var app = express()

// 将暂存到内存中的 webpack 编译后的文件挂在到 express 服务上
app.use(devMiddleware)

// 将 Hot-reload 挂在到 express 服务上并且输出相关的状态、错误
app.use(hotMiddleware)
// 为静态资源提供响应服务
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var compiler = webpack(webpackConfig) // 启动 webpack 进行编译

// 让我们这个 express 服务监听 port 的请求，并且将此服务作为 dev-server.js 的接口暴露
module.exports = app.listen(port, function (err) {
    if (err) {
        console.log(err)
        return
    }
    var uri = 'http://localhost:' + port
    console.log('Listening at ' + uri + '\n')
})