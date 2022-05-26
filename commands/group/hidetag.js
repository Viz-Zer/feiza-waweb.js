const { MessageMedia } = require("whatsapp-web.js")
const fs = require("fs")

module.exports = {
    name: "hidetag",
    alias: ["totag","tagall"],
    desc: "Send Message With Tag All Participants",
    type: "group",
    start: async(feiza, m, { participants, quoted, text }) => {
        let _participants = participants.map(v => v.id._serialized)
        let mentions = []
        for (let jid of _participants) mentions.push(await feiza.getChatById(jid))
        if (m.hasMedia) {
            let message = await quoted.downloadMedia()
            feiza.sendMessage(m.from, message, { mentions })
        } else {
            feiza.sendMessage(m.from, text, { mentions })
        }
    },
    isGroup: true,
    isAdmin: true
}
