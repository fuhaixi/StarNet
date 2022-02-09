const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { template } = require('lodash');

//这里注册页面
let entry_path=['./src/index.html','./test/example.html']



let html_pages = entry_path.map((str)=>{
    let filename=/([^\/]+)(?=\.\w+$)/gm.exec(str)[0]
    return new HtmlWebpackPlugin(
        {
            filename:filename + '.html',
            template:str,
            chunks:[filename]
        }
    )
})

let entrys={}
html_pages.forEach((value)=>{
    entrys[value.userOptions.chunks] = value.userOptions.template.replace(/(\.\w+$)/igm,'.js')
})


module.exports = {
    mode: 'development',
    entry: entrys,//入口js文件
    devServer: {
        static: './dist',
    },
    plugins: [
        ...html_pages,//html文件
        new CopyPlugin({patterns:
            [{from:'asset',to:'asset'},{from:'style',to:'style'}]})

    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
};