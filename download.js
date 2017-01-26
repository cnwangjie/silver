const child_process = require('child_process')
let data = require('./data.js')

module.exports = (url, protocol, key) => {
    if (protocol == null) {
        protocol = url.slice(0, url.indexOf('://'))
    }

    data.new(key, url)
    child_process.exec('wget -q -O ' + key + ' -c --tries=3 '+url)
        .on('close', (code) => {
            if (code == 0) {
                data.statusChange(key, 'complete')
                return
            }

            data.statusChange(key, 'error')
        })
}
