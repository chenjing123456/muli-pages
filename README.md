

### 多页面配置
多页面项目配置，遵循一个端多个页面原则创建文件夹和文件，创建文件的规则写在配置文件夹config里。

 * 在config/fileName文件 新增端和文件名
 * 在根目录创建进程文件，规定当前进程对象(eg:.env.gov .env.govDev)
 * 在package.json 文件创建script脚本命令，包括启动命令和打包命令 (eg:"vue-cli-service serve --open --mode govDev)
 * 在config/template创建模板文件
 * 运行npm run new gov ，或者可以node createGov.js 创建某个端的多页面文件