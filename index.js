if (typeof process === 'object') {
    eval(`module.exports = require('package-auto-tsc')(__dirname)`)
} else {
    module.exports = require('./lib')
}
