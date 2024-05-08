// const path = require("path");
import path from 'path';

const aliases = {
    '@': 'src',
    // '@lib': path.resolve(__dirname, 'src/assets/lib'),
    '@js': path.resolve(__dirname, 'src/assets/js'),
    '@img': path.resolve(__dirname, 'src/assets/img'),
    '@css': path.resolve(__dirname, 'src/assets/css'),
    '@stores': path.resolve(__dirname, 'src/stores'),
    '@components': path.resolve(__dirname, 'src/assets/js/components')
}

const exports = {
    webpack: {}
};

for (const alias in aliases) {
    const aliasTo = aliases[alias];
    exports.webpack[alias] = resolveSrc(aliasTo);
}

function resolveSrc(_path) {
    return path.resolve(__dirname, _path);
}