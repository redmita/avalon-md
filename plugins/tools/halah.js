let handler = async (m, { conn, text, command, usedPrefix }) => {
	text = text ? text : m.quoted?.text ? m.quoted.text : ''
	if (!text) return m.reply('ngapain?')
	try {
		let vocal = command.charAt(1)
		await m.reply(text.toLowerCase().replace(/[aiueo]/gi, vocal))
	} catch (e) {
		m.reply(e.message)
	}
}

handler.help = ['halah', 'hilih', 'huluh', 'heleh', 'holoh']
handler.tags = ['tools']
handler.command = /^(halah|hilih|huluh|heleh|holoh)$/i

export default handler