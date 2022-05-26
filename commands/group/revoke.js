const util = require("util")
const { jsonformat } = require("../../lib/Function")

module.exports = {
    name: "revoke",
    alias: ["reset","resetlink"],
    desc: "Revoke Group Link",
    type: "group",
    start: async(feiza, m) => {
        let chat = await m.getChat()
        if (chat.isGroup) {
            await chat.revokeInvite().then((res) => {
                m.reply(jsonformat(res))
            }).catch((err) => {
                m.reply(jsonformat(err))
            })
        } else {
            m.reply("This Feature is Only in Group")
        }
    },
    isAdmin: true
}
