import axios from 'axios'
import { isUrl } from '../../lib/func.js'

const key = ['5d66c49bb5a44eabbf2b0bebad458551','5adc69df3688402283cbf8edb7ccc90d','0a8493e06e0145418ad06ba81ec0c396']
const uagent = {
	android: 'Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.6943.137 Mobile Safari/537.36',
	web: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36',
	ios: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_7_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1',
	mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_7_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Safari/605.1.15'
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
	if (!args[0]) throw `Example : ${usedPrefix + command} https://google.com`
	if (!isUrl(args[0])) throw `url invalid, please input a valid url. Try with add http:// or https://`
	//await conn.sendFile(m.chat, `https://www.screenia.best/api/screenshot?url=${args[0]}${command.includes('full') ? '&fullscreen=true' : ''}&type=png`, '', `_${command} by ${pauthor}_`.trim(), m)
	try {
		let extra = /hp|ios/.test(command) ? { width: 1080, height: 1920 } : { width: 1600, height: 900 } 
		let { data } = await axios.get('https://api.apiflash.com/v1/urltoimage', {
			params: {
				access_key: key.getRandom(),
				url: args[0],
				response_type: 'json',
				ttl: 10800,
				scale_factor: 2,
				no_cookie_banners: true,
				no_ads: true,
				...extra
			},
			headers: {
				'user-agent': uagent[/hp/.test(command) ? 'android' : /ios/.test(command) ? 'ios' : /mac/.test(command) ? 'mac' : 'web']
			}
		}).catch((e) => e?.response)
		if (!data.url) throw Error()
		await conn.sendFile(m.chat, data.url, '', `_${/hp|ios/.test(command) ? 'Portrait' : 'Desktop'} Screenshot_`.trim(), m)
	} catch (e) {
		console.log(e)
		let fimg = await fetch(`https://mini.s-shot.ru/${/hp/.test(command) ? '1170x2532' : '1600x900'}/PNG/2560/Z100/?`+args[0])
		await conn.sendFile(m.chat, fimg.status == 200 ? Buffer.from(await fimg.arrayBuffer()) : `https://aemt.uk.to/ss${/hp/.test(command) ? 'hp' : 'pc'}?url=${args[0]}`, '', `_${/hp/.test(command) ? 'Portrait' : 'Desktop'} Screenshot_`.trim(), m)
	}
}

handler.help = ['ssweb <url>','sshp <url>']
handler.tags = ['information']
handler.command = /^(ss(web|hp|ios|mac)?)$/i

handler.premium = true
handler.limit = true

export default handler