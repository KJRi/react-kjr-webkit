// webpack 默认配置
const path = require('path');
// 压缩css文件
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
// 用于处理多路径文件，使用purifycss的时候要用到glob.sync方法
const glob = require('glob-all')
// css tree shanking 摇树
// webpack-cil中[webpack-cli] TypeError: compiler.plugin is not a function
// 将purifycss-webpack更换为purgecss-webpack-plugin
const purifyCss = require('purgecss-webpack-plugin')

module.exports = {
    mode: 'production',
    plugins: [
        // 压缩css文件
        new OptimizeCssAssetsWebpackPlugin({
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                // 去掉注释
                preset: ["default", { discardComments: { removeAll: true } }]
            }
        }),
        new purifyCss({
            paths: glob.sync([
                path.resolve(__dirname, './*html'),
                path.resolve(__dirname, './src/*js')
            ])
        })
    ],
    // 通过webpack打包提取公共代码
    optimization: {
        // js 开启 tree shanking
        usedExports: true,
        //如果mode是production类型，minimize的默认值是true，执行默认压缩，
        //允许你使用第三方的压缩插件，可以在optimization.minimizer的数组列表中进行配置
        minimize: false,
        splitChunks: {
            // 默认作用于异步chunk，值为all/initial/async/function(chunk),值为function时第一个参数为遍历所有入口chunk时的chunk模块，chunk._modules为chunk所有依赖的模块，通过chunk的名字和所有依赖模块的resource可以自由配置,会抽取所有满足条件chunk的公有模块，以及模块的所有依赖模块，包括css
            chunks: 'all', 
            minSize: 30000, //表示在压缩前的最小模块大小，默认值是30kb
            minChunks: 1,//表示被引用次数，默认为1
            maxAsyncRequests: 5,//所有的异步请求不得超过5个
            maxInitialRequests: 3,//初始话并行请求不得超过3个
            automaticNameDelimiter: '~', //名称分隔符，默认是~
            // name: true, //打包后的名称，默认是chunk的名字通过分隔符（~）分割
            cacheGroups: {//设置缓存组用来抽取满足不用规则的chunk，下面以生产common为例
                common: {
                    name: 'common',//抽取的chunk的名字
                    chunks(chunk) {
                        //同外层的参数配置，覆盖外层的chunks，以chunk为维度进行抽取
                    },
                    test(module, chunks) {
                        //可以为字符串，正则表达式，函数，以module为维度进行抽取，只要是满足条件的module都会被抽取到该common的chunk中，为函数时第一个参数是遍历到的每一个模块，第二个参数是每一个引用到该模块的chunks数组。不能提取出css，待进一步验证。
                    },
                    priority: 10, //优先级，一个chunk很可能满足多个缓存组，会被抽取到优先级高的缓存组中
                    minChunks: 2,//最少被几个chunk引用
                    reuseExistingChunk: true, //如果该chunk中引用了已经被抽取的chunk，直接引用该chunk，不会重复打包代码
                    enforce: true, //如果cacheGroup中没有设置minSize,则据此判断是否使用上层的minSize,true则使用0， false则使用上层minSize
                }
            }
        }
    }
}