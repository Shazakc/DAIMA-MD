var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod }
}
Object.defineProperty(exports, "__esModule", { value: true })

const axios = require("axios")
const cheerio = require("cheerio")
const { resolve } = require("path")
const Jimp = require('jimp')
const util = require("util")
let BodyForm = require('form-data')
let { fromBuffer } = require('file-type')
//let fetch = require('node-fetch')
let fs = require('fs')



exports.sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

exports.fetchBuffer = async (url, options) => {
        try {
                options ? options : {}
                const res = await axios({
                        method: "GET",
                        url,
                        headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.70 Safari/537.36",
                                'DNT': 1,
                                'Upgrade-Insecure-Request': 1
                        },
                        ...options,
                        responseType: 'arraybuffer'
                })
                return res.data
        } catch (err) {
                return err
        }
}
exports.webp2mp4File=async(path) =>{
        return new Promise((resolve, reject) => {
                 const form = new BodyForm()
                 form.append('new-image-url', '')
                 form.append('new-image', fs.createReadStream(path))
                 axios({
                          method: 'post',
                          url: 'https://s6.ezgif.com/webp-to-mp4',
                          data: form,
                          headers: {
                                   'Content-Type': `multipart/form-data; boundary=${form._boundary}`
                          }
                 }).then(({ data }) => {
                          const bodyFormThen = new BodyForm()
                          const $ = cheerio.load(data)
                          const file = $('input[name="file"]').attr('value')
                          bodyFormThen.append('file', file)
                          bodyFormThen.append('convert', "Convert WebP to MP4!")
                          axios({
                                   method: 'post',
                                   url: 'https://ezgif.com/webp-to-mp4/' + file,
                                   data: bodyFormThen,
                                   headers: {
                                                'Content-Type': `multipart/form-data; boundary=${bodyFormThen._boundary}`
                                   }
                          }).then(({ data }) => {
                                   const $ = cheerio.load(data)
                                   const result = 'https:' + $('div#output > p.outfile > video > source').attr('src')
                                   resolve({
                                                status: true,
                                                message: "Created By NEXA",
                                                result: result
                                   })
                          }).catch(reject)
                 }).catch(reject)
        })
}

exports.fetchUrl = async (url, options) => {
    try {
        options ? options : {}
        const res = await axios({
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'
            },
            ...options
        })
        return res.data
    } catch (err) {
        return err
    }
}

exports.generateProfilePicture = async (buffer) => {
        const jimp = await Jimp.read(buffer)
        const min = jimp.getWidth()
        const max = jimp.getHeight()
        const cropped = jimp.crop(0, 0, min, max)
        return {
                img: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),
                preview: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG)
        }
}

exports.getBuffer = async (url, options) => {
        try {
                options ? options : {}
                const res = await axios({
                        method: "get",
                        url,
                        headers: {
                                'DNT': 1,
                                'Upgrade-Insecure-Request': 1
                        },
                        ...options,
                        responseType: 'arraybuffer'
                })
                return res.data
        } catch (err) {
                return err
        }
}


exports.WAVersion = async () => {
    let get = await exports.fetchUrl("https://web.whatsapp.com/check-update?version=1&platform=web")
    let version = [get.currentVersion.replace(/[.]/g, ", ")]
    return version
}

exports.getRandom = (ext) => {
    return `${Math.floor(Math.random() * 10000)}${ext}`
}

exports.isUrl = (url) => {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, 'gi'))
}

exports.isNumber = (number) => {
    const int = parseInt(number)
    return typeof int === 'number' && !isNaN(int)
}
