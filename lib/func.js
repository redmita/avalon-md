import axios from 'axios'
import * as cheerio from 'cheerio'
import Jimp from 'jimp'
import { spawn } from 'child_process'

function _token(host) {
	return new Promise(async (resolve, reject) => {
		axios.request({
			url: host, method: 'GET', headers
		}).then(({ data }) => {
			let $ = cheerio.load(data)
			let token = $('#token').attr('value')
			resolve(token)
		})
	})
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function cSize(fileSize) {
	const units = {
		'B': 1,
		'KB': 1024,
		'MB': 1024 * 1024,
		'GB': 1024 * 1024 * 1024
	};
	
	let [, size, unit] = /^([\d.]+)\s*(\w+)$/.exec(fileSize);
	let bytes = parseFloat(size) * units[unit.toUpperCase()];
	
	return bytes < 450 * 1024 * 1024;
}

const delay = time => new Promise(res => setTimeout(res, time))

function generate(n) {
	var add = 1, max = 12 - add
	if ( n > max ) return generate(max) + generate(n - max)
		max = Math.pow(10, n+add)
	var min = max/10
	var number = Math.floor( Math.random() * (max - min + 1) ) + min
	return ('' + number).substring(add)
}

async function getBuffer(url, options){
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

const getRandom = (ext) => {
	return `${Math.floor(Math.random() * 10000)}${ext}`
}

const headers = {
	"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
	"cookie": "PHPSESSID=ugpgvu6fgc4592jh7ht9d18v49; _ga=GA1.2.1126798330.1625045680; _gid=GA1.2.1475525047.1625045680; __gads=ID=92b58ed9ed58d147-221917af11ca0021:T=1625045679:RT=1625045679:S=ALNI_MYnQToDW3kOUClBGEzULNjeyAqOtg"
}

function isNumber(number) {
	if (!number) return number
	number = parseInt(number)
	return typeof number == 'number' && !isNaN(number)
}

function isUrl(string) {
	try {
		new URL(string);
		return true;
	} catch (err) {
		return false;
	}
}

function niceBytes(x) {
	let units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	let l = 0, n = parseInt(x, 10) || 0;
	while(n >= 1024 && ++l){
		n = n/1024;
	}
	return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}

function padLead(num, size) {
	var s = num+"";
	while (s.length < size) s = "0" + s;
	return s;
}

function pickRandom(list) {
	return list[Math.floor(list.length * Math.random())]
}

function ranNumb(min, max = null) {
	if (max !== null) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	} else {
		return Math.floor(Math.random() * min) + 1
	}
}

const mime = await (await fetch('https://raw.githubusercontent.com/redmita/json-db/refs/heads/master/mime.json')).json()
const readMore = String.fromCharCode(8206).repeat(4001)

async function resize(buffer, width, height) {
	var oyy = await Jimp.read(buffer);
	var kiyomasa = await oyy.resize(width, height).getBufferAsync(Jimp.MIME_JPEG)
	return kiyomasa
}

function runtime(seconds) {
	seconds = Number(seconds);
	var d = Math.floor(seconds / (3600 * 24));
	var h = Math.floor(seconds % (3600 * 24) / 3600);
	var m = Math.floor(seconds % 3600 / 60);
	var s = Math.floor(seconds % 60);
	var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
	var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
	var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
	var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
	return dDisplay + hDisplay + mDisplay + sDisplay;
}

function runtimes(seconds) {
	seconds = Number(seconds);
	var d = Math.floor(seconds / (3600 * 24));
	var h = Math.floor(seconds % (3600 * 24) / 3600);
	var m = Math.floor(seconds % 3600 / 60);
	var s = Math.floor(seconds % 60);
	var dDisplay = d > 0 ? d + "d " : "";
	var hDisplay = h < 10 ? "0" + h + ":" : h > 0 ? h + ":" : "";
	var mDisplay = m < 10 ? "0" + m + ":" : m > 0 ? m + ":" : "";
	var sDisplay = s < 10 ? "0" + s : s > 0 ? s : "";
	return dDisplay + hDisplay + mDisplay + sDisplay;
}

const someincludes = ( data, id ) => {
	let res = data.find(el => id.includes(el) )
	return res ? true : false;
}

const somematch = ( data, id ) => {
	let res = data.find(el => el === id )
	return res ? true : false;
}

function stream2buffer(stream) {
	return new Promise((resolve, reject) => {		
		const _buf = [];
		stream.on("data", (chunk) => _buf.push(chunk));
		stream.on("end", () => resolve(Buffer.concat(_buf)));
		stream.on("error", (err) => reject(err));
	})
}

async function urlwebp2img(url) {
	return new Promise(async (resolve, reject) => {
		const fimg = await fetch(url)
		const img = Buffer.from(await fimg.arrayBuffer())
		const bufs = []
		const [_spawnprocess, ..._spawnargs] = [...(global.support.gm ? ['gm'] : global.support.magick ? ['magick'] : []), 'convert', 'webp:-', 'png:-']
		let im = spawn(_spawnprocess, _spawnargs)
		im.on('error', (err) => reject(err))
		im.stdout.on('data', chunk => bufs.push(chunk))
		im.stdin.write(img)
		im.stdin.end()
		im.on('exit', async () => {
			resolve(Buffer.concat(bufs))
		})
	})
}

export {
	_token,
	capitalizeFirstLetter,
	cSize,
	delay,
	generate,
	getBuffer,
	getRandom,
	headers,
	isUrl,
	isNumber,
	mime,
	niceBytes,
	padLead,
	pickRandom,
	ranNumb,
	resize,
	runtime,
	runtimes,
	readMore,
	someincludes,
	somematch,
	stream2buffer,
	urlwebp2img
}