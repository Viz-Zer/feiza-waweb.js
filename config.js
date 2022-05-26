const fs = require("fs")
const chalk = require("chalk")


global.reloadFile = (file, options = {}) => {
    nocache(file, module => console.log(`File "${file}" has updated`))
}


// Rest Api
global.APIs = {
	zenz: 'https://zenzapis.xyz',
}

// Apikey
global.APIKeys = {
	'https://zenzapis.xyz': 'Your Apikey',
}

// Other
global.mess = (type, m) => {
    let msg = {
        owner: 'This command can only be used by the Owner!',
        group: 'This command can only be used in groups!',
        private: 'This command can only be used in private chat!',
        admin: 'This command can only be used by group admins!',
        botAdmin: 'Bots are not admins, cannot access the feature',
        bot: 'This feature can only be accessed by bots',
        dead: 'This feature is being turned off!',
        media: 'Reply to a media',
        error: "No Results Found"
    }[type]
    if (msg) return m.reply(msg)
}
global.options = {
    autoRead: true,
    mute: false,
    public: true
}
global.owner = ["919526433047"]
global.sessionName = "feiza"
global.packname = "feiza"
global.author = "Viz-Zer"


function nocache(module, cb = () => {}) {
    //console.log(chalk.whiteBright(`Load File "${module}"`))
    fs.watchFile(require.resolve(module), async () => {
        await uncache(require.resolve(module))
        cb(module)
    })
}

function uncache(module = '.') {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(module)]
            resolve()
        } catch (e) {
            reject(e)
        }
    })
}

let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update File "${file}"`))
})
