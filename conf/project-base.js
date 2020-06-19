const path = require('path')

module.exports = {
    project_base: (...parts) => path.join(__dirname, '..', ...parts),
}
