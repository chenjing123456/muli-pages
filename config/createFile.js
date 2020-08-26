const fs = require('fs')
const path = require('path')

const createPage = require('./createTemp')
const fileConfig = require('./fileName')
const { defaultFileConfig } = require('./config.file')

const createProj = function (dir) {
  Object.keys(fileConfig[dir]).forEach(path => {
    let config = Object.assign({}, defaultFileConfig, fileConfig[dir][path])
    createPage(dir, path, config)
  })
}
module.exports = createProj
