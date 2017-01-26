const fs = require('fs')
module.exports.new = function (key, url) {
    return modify((data) => {
        data[key] = {
            url: url
            ,status: 'downloading'
            ,time: Date.now()
        }
    })
}

module.exports.delete = function (key) {
    return modify((data) => {
        delete data[key]
        fs.unlinkSync('./saved/' + key)
    })
}

module.exports.statusChange = function (key, status) {
    return modify((data) => {
        data[key].status = status
    })
}

function modify (cb) {
    let data = fs.readFileSync('./data.json')
    data = JSON.parse(data)

    cb(data)

    fs.writeFileSync('./data.json', JSON.stringify(data, null, 4))
    return true
}
