// webpack 默认配置
const path = require('path');
const webpack = require('webpack')
// 将js引入html文件中
const AddAssettHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')
const { merge } = require('webpack-merge')
const webpackBase = require('./webpack.base.config')

// merge 用法和 Object.assign 类似
module.exports = merge(webpackBase, {
    mode: 'development',
    plugins: [
        // 启用模块热替换(HMR - Hot Module Replacement)
        new webpack.HotModuleReplacementPlugin(),
        // 公共依赖缓存起来，不用每次运行都打包一遍
        new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, './dll/react-manifest.json')
        }),
        new AddAssettHtmlWebpackPlugin({
            filepath: path.resolve(__dirname, './dll/react.dll.js')
        })
    ],
    // 是否开启 source-map
    // 和 eval 类似，但是把注释里的 sourceMap 都转为了 DataURL 。
    devtool: 'eval-source-map',
    // 启动项目
    devServer: {
        // 指向打包后的文件地址
        contentBase: './dist',
        // 是否自动打开一个新窗口
        open: true,
        // 端口号
        port: 8000,
        // 是否开启热更新
        hot: true,
        // 启动热模块替换，而不会在构建失败时将页面刷新作为后备。
        hotOnly: true
    },
})