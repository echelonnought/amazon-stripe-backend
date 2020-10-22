if (process.env.NOD_ENV === 'production') {
    module.exports = require('./keys_prod');
} else {
    module.exports = require('./key_dev');
}