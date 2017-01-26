const express = require('express')
const fs = require('fs');
let download = require('./download.js');
let config = require('./config.js')
let app = express()

if (config.static) {
    app.use(express.static('./public'))

    app.get('/', (req, res) => {
        res.sendFile('./public/index.html')
    })
}

app.get('/data', (req, res) => {
    let data = fs.readFileSync('./data.json')
    res.json(JSON.parse(data)).end()
})
app.use('/download', express.static('./saved'))

app.get('/download', (req, res) => {
    if (!('token' in req.query) || !('url' in req.query) || !('key' in req.query)) {
        res.status(400).json({
            status: 'error'
            ,error: 'missing parameters'
        }).end()
        return
    }

    let token = req.query.token

    if (token != config.token) {
        res.status(403).json({
            status: 'error'
            ,error: 'token wrong'
        }).end()
        return
    }

    let url = encodeURI(req.query.url)
    let protocol = url.slice(0, url.indexOf('://'))

    if (!config.protocols.includes(protocol)) {
        res.status(403).json({
            status: 'error'
            ,error: 'resource protocal unsupport'
        }).end()
        return
    }

    let key = req.query.key

    if (fs.existsSync('./saved/' + key)) {
       res.status(403).json({
          status: 'error'
          ,error: 'file is exist'
       }).end()
       return
    }

    download(url, protocal, key)
    res.status(200).json({
        status: 'start download'
    }).end()
    return


})

app.delete('/:key', (req, res) => {

})

app.listen(8080)
