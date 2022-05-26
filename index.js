require("./config")
const fs = require("fs")
const yargs = require("yargs/yargs")
const chalk = require("chalk")
const qrcode = require("qrcode-terminal")
const util = require("util")
const path = require("path")
const Commands = new Map()
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js")
const { jsonformat } = require("./lib/Function")


global.api = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({ ...query, ...(apikeyqueryname ? { [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name] } : {}) })) : '')
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())

const readCommands = () => {
    let dir = path.join(__dirname, "./commands")
    let dirs = fs.readdirSync(dir)
    let listType = []
    let listCommand = {}
    try {
        dirs.forEach(async (res) => {
            let groups = res.toLowerCase()
            Commands.type = dirs.filter(v => v !== "_").map(v => v)
            listCommand[groups] = []
            let files = fs.readdirSync(`${dir}/${res}`).filter((file) => file.endsWith(".js"))
            for (const file of files) {
                const command = require(`${dir}/${res}/${file}`)
                let options = {
                    name: command.name ? command.name : "",
                    alias: command.alias ? command.alias : [],
                    desc: command.desc ? command.desc : "",
                    type: command.type ? command.type : "",
                    example: command.example ? command.example : "",
                    isMedia: command.isMedia ? command.isMedia : false,
                    isOwner: command.isOwner ? command.isOwner : false,
                    isGroup: command.isGroup ? command.isGroup : false,
                    isPrivate: command.isPrivate ? command.isPrivate : false,
                    isBotAdmin: command.isBotAdmin ? command.isBotAdmin : false,
                    isAdmin: command.isAdmin ? command.isAdmin : false,
                    isBot: command.isBot ? command.isBot : false,
                    disable: command.disable ? command.disable : false,
                    isQuery: command.isQuery ? command.isQuery : false,
                    start: command.start ? command.start : () => {}
                }
                listCommand[groups].push(options)
                Commands.set(options.name, options)
                global.reloadFile(`${dir}/${res}/${file}`)
            }
        })
        Commands.list = listCommand
    } catch (e) {
        console.error(e)
    }
}

let sessionPath = `./tmp/${global.sessionName}`

async function connect() {
    await readCommands()
    const feiza = new Client({
        authStrategy: new LocalAuth({
            dataPath: `./${global.sessionName}`
        }),
        puppeteer: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    })

    feiza.initialize()

    if (global.opts["server"]) {
        require("./lib/Server")(feiza, process.env.PORT || 8000)
    } else if (!global.opts["server"]) {
        feiza.on("qr", qr => {
            qrcode.generate(qr, { small: true })
        })
    }

    feiza.on("authenticated", async(auth) => {
        console.log(auth)
    })

    feiza.on("auth_failure", async(auth_err) => {
        console.log(auth_err)
    })

    feiza.on("ready", () => {
        console.log(chalk.greenBright("Client Is Already Running"))
    })

    feiza.on("disconnected", async(reason) => {
        console.log("Disconnect ", reason)
        connect()
    })

    feiza.on("message_create", (msg) => {
        try {
            if (!msg) return
            if (!global.options.public && !msg.fromMe) return
            if (msg.id.id.startsWith("3EB") && msg.id.id.length == 20) return
            require("./feiza_chat")(feiza, msg, Commands)
        } catch(e) {
            console.error(e)
        }
    })

    feiza.on("group_update", (action) => {
        if (!action) return action
        require("./feiza_group")(feiza, action)
    })

    return feiza
}

connect()
