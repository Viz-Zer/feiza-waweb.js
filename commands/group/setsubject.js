const util = require("util")
const { jsonformat } = require("../../lib/Function")

module.exports = {
    name: "setsubject",
    alias: ["setname"],
    desc: "Change Group Name in Group",
    type: "group",
    example: "Example : %prefix%command <name>",
    start: async(feiza, m, { text }) => {
        let chat = await m.getChat()
        chat.setSubject(text).then((res) => {
            m.reply(jsonformat(res))
        }).catch((err) => {
            m.reply(jsonformat(err))
        })
    },
    isQuery: true,
    isGroup: true,
    isAdmin: true
}
