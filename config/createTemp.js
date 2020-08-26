const fs = require("fs");
var colors = require('colors');
const path = require('path');
const { getCreateConfig } = require('./config.file');

// 检验过的Dir存一下，防止反复sync取
const checkedDir = {};
/**
 * 文件的目录， 返回所需创建文件的promise
 * @param {文件目录} dirname 
 */
function createDir(dirname) {

    let paths = dirname.split(/[\/\\\\]/);


    return new Promise(function (resolve, reject) {
        paths.reduce((base, el, idx) => {
             base = base === "" ? '/' :base;//mac下第一个 / 被截断后为 “”
            let curPath = path.join(base, el);

            if (!checkedDir[base] || fs.statSync(base).isDirectory()) {
                checkedDir[base] = true;
               
                if (!fs.existsSync(curPath)) {
                    // 有.的时候认为是文件
                    if (el.indexOf('.') > -1) {
                        console.log('不存在文件，开始创建：'.blue, curPath)
                        resolve()
                    } else {
                        fs.mkdirSync(curPath);
                    }
                } else {
                    
                    if (el.indexOf('.') > -1) {
                        console.log('已存在'.yellow, curPath)
                        reject({
                            msg: '已存在'.yellow,
                            path: curPath
                        })
                    }
                }

            } else {
                reject({
                    msg: '文件下不能创建文件'.red,
                    path: curPath
                })
            }
            return curPath
        })
    })

}

function createFile({ filename, template }, fileConfig) {
    return new Promise((resolve) => {
        let str = fs.readFileSync(template).toString();
        let f = new Function('config', 'return `' + str + '`');
        resolve(f(fileConfig));
    }).then(res => {
        return new Promise(function (resolve, reject) {
            fs.writeFile(filename, res, (error) => {
                if (error) {
                    console.log('出现问题了', `${error}`.red);
                    reject(error)
                } else {
                    resolve('success');
                    console.log('创建成功'.green, `${filename}`);
                }
            })
        })

    }, error => {

    })
}


module.exports = function createPage(dir, path, fileConfig) {
    let pathConfig = getCreateConfig(dir);
    fileConfig._filename = path;
    Promise.all(Object.entries(pathConfig).map(([k, v]) => {
        v.filename = v.filename.replace(/\${filename}/g, path);

        return fileConfig[k] && createDir(v.filename).then(res => {
            let paths = v.filename.split(/[\/\\\\]/);

            if (paths[paths.length - 1].indexOf('.') > -1) {
                return createFile(v, fileConfig);
            }
            return false
        })
    })).then(res => {
        console.log('创建成功')
    }, error => {
        console.log(error.msg, error.path)
    })

}