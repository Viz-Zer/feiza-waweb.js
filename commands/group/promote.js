const util = require("util")
const { jsonformat } = require("../../lib/Function")


module.exports = {
    name: "promote",
    alias: ["admin"],
    desc: "Make User as Admin in Group",
    type: "group",
    example: "Example : %prefix%command <tag>. <tag> = @91xxx",
    start: async(feiza, m, { participants }) => {
        let chat = await m.getChat()
        let members = participants.filter(v => !v.isAdmin).map(v => v.id._serialized)
        let users = m.mentionedIds.filter(v => members.includes(v))
        for (let user of users) chat.promoteParticipants([user]).then((res) => {
            m.reply(jsonformat(res))
        }).catch((err) => {
            m.reply(jsonformat(err))
        })
    },
    isGroup: true,
    isAdmin: true
}
