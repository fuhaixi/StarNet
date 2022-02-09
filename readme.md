# 开始
`npm run build`: 构建

`npm run dev`: 开启本地服务器

# 注意

dist目录中，asset和style文件夹直接拷贝于主目录，其余js和html由webpack生成

如果要添加一个html页面，需要在/webpack.congfig.js中注册路径。

不要再html中加script标签，
创建一个同路径的js文件后会自动添加