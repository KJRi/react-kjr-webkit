// webpack 默认配置
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); 


module.exports = {
    // 项目入口文件 支持 str | [] | {}
    entry: path.resolve(__dirname, './src/index.js'),
    // 项目出口 
    output: {
        path: path.join(__dirname, './dist'),
        // 模块标识符(module identifier)的 hash 取前8位
        filename: "[name].[hash:8].bundle.js"
    },
    // 打包环境 默认是生产环境 production
    // 如果是开发环境 这里需要换成 development
    // 接下来为了观察打包后的文件，使用 development
    mode: 'development',
    // 模块 这些选项决定了如何处理项目中的不同类型的模块。
    module: {
        rules: [
            {
                // 打包css文件
                test: /\.(css|less)$/,
                use: [
                    // 插件需要参与模块解析，须在此设置此项，不再需要style-loader    
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // 在此处指定publicPath
                            // 默认情况下，它在webpackOptions.output中使用publicPath
                            publicPath: '../',
                            hmr: true, // 模块热替换，仅需在开发环境开启
                        },
                        // 这里会直接到src文件下找less/css文件进行编译，优化
                        // include: path.resolve(__dirname, './src')
                    },
                    'css-loader',
                    'less-loader',
                    'postcss-loader'
                ]
            },
            {
                // 打包图片资源
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {},
                    },
                ]
            },
            {
                // 代码转换
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                // ts
                test: /\.ts$/,
                use: 'ts-loader'
            }
        ]
    },
    // 插件
    plugins: [
        // 复制一个html并将最后打包好的资源在html中引入
        new htmlWebpackPlugin({
            // 页面title 需要搭配ejs使用
            title: "KOLDZ",
            // html 模板路径 template : project.paths.client('index.html'),
            template: "./index.html",
            // 输出文件名称
            filename: "index.html",
            minify: {
                // 压缩HTML文件
                removeComments: true, //移除注释
                collapseWhitespace: true, //删除空白符与换行符
                minifyCSS: true // 压缩内联css
            }
        }),
        // 每次部署时清空dist目录
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            // 选项类似于webpackOptions.output中的相同选项
            // 所有选项都是可选的
            filename: "[name].css",
            chunkFilename: "[id].css",
            ignoreOrder: false, //启用以删除有关顺序冲突的警告
        })
    ],
    resolve: {
        // 规定在那里寻找第三方模块
        modules: [path.resolve(__dirname, './node_modules')],
        // 别名 我们可以通过别名的方式快速定位到引用包的/方法的路径，优化打包和运行本地服务
        alias: {
            react: path.resolve(__dirname, './node_modules/react/umd/react.production.min.js'),
            'react-dom': path.resolve(__dirname, './node_modules/react-dom/umd/react-dom.production.min.js'),
            '@': path.resolve(__dirname, './src')
        },
        // 自动补齐后缀名，这个列表会让webpack一级一级寻找，尽量少配置
        extensions: ['.js', '.jsx']
    }
}
