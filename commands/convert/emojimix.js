const { MessageMedia } = require("whatsapp-web.js")
const { fetchUrl } = require("../../lib/Function")

module.exports = {
    name: "emojimix",
    alias: ["emojimashup"],
    desc: "Combine 2 Emoji",
    type: "convert",
    example: "Example : %prefix%command 😎+😾",
    start: async(feiza, m, { text }) => {
        let [emoji1, emoji2] = text.split`+`
        let fetch = await fetchUrl(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`)
        for (let url of fetch.results) {
            let message = await MessageMedia.fromUrl(url)
            feiza.sendMessage(m.from, message, { quotedMessageId: m.id._serialized, sendMediaAsSticker: true, stickerName: global.packname, stickerAuthor: global.author, stickerCategories: ['😎','😾','🤖️'] })
        }
    },
    isQuery: true
}
