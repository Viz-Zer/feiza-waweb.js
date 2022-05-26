module.exports = {
    name: "caripesan",
    alias: ["searchmsg"],
    desc: "Search Message From Chat",
    type: "tool",
    example: "Example : %prefix%command <query>, limit",
    start: async(feiza, m, { text }) => {
        let [text1, text2] = text.split`,`
        let fetch = await feiza.searchMessages(text1, { page: 1, limit: text2 || null, chatId: m.from })
        let total = fetch.length
        let sp = total < Number(text2) ? `Found Only ${total} Message` : `Found ${total} message`
        m.reply(sp)

        fetch.map(async ({ id }) => {
            let { remote: remoteJid, _serialized: serial } = id
            feiza.sendMessage(m.from, "Here's the message", { quotedMessageId: serial })
        })
    },
    isQuery: true
}
