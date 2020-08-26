// 本文件用于验证同名导出
// 防止错误发生
// node环境
const path = require('path');
const fs = require('fs');
const chalk = require('chalk')

let dirArr = process.argv.slice(2);


let exportMap = {};
let promsieArr = []
dirArr.forEach(pathname => {
    pathname = path.resolve(__dirname, pathname)
    if (fs.existsSync(pathname)) {
        if (fs.statSync(pathname).isDirectory()) {
            let fileArr = fs.readdirSync(pathname);
            promsieArr.push(...fileArr.map(item => {
                return checkFile(path.resolve(pathname, item), item);
            }))
        } else if (fs.statSync(pathname).isFile()) {
            promsieArr.push(checkFile(pathname, pathname));
        }
    }
})

function readDirCycle(pathname){

}

// 单个导出
let reg = /(?<=^\s*export\s+(const|var|let|function|enum|new)\s+)[a-zA-Z_&$][a-zA-Z_&1-9$]*(?=\s*([\();\n={]))/gm;

// export {}
let reg1 = /(?<=^\s*export\s+{\s*([a-zA-Z_&$][a-zA-Z_&1-9$]*\s*,\s*)*)[a-zA-Z_&$][a-zA-Z_&1-9$]*(?=[,\s}])/gm;
function checkFile(pathname, filename) {
    return new Promise(function (resolve, reject) {
        fs.readFile(pathname, (error, file) => {
            if (error) {
                reject();
            }
            let arr = file.toString().match(reg) || [];
            arr.push(...(file.toString().match(reg1) || []));
            Array.isArray(arr) ? arr.forEach(v => {
                addProp(v, filename)
            }) : addProp(arr, filename)
            resolve();
        })
    })

}


function addProp(prop, filename) {
    if (!exportMap[prop]) {
        exportMap[prop] = [filename]
    } else {
        exportMap[prop].push(filename)
    }
}

Promise.all(promsieArr).then(res => {
    // console.log(exportMap)

    for (let entries of Object.entries(exportMap)) {
        if (entries[1].length === 1) {

        } else {
            chalk.red(`${entries[0]}: ${entries[1]}`)
        }
    }

   
})