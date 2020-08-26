let createProj = require('../createFile');

// npm run new (ent | gov  | h5)
// node ./create.js (ent | gov  | h5)
let pathnames = process.argv.slice(2);

pathnames.forEach(pathname => {
    process.env.selfDirName = pathname;
    createProj(pathname)
})
