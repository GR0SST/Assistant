/**
* @name Assistant
* @displayName Assistant
* @source https://raw.githubusercontent.com/GR0SST/Assistant/main/Assistant.plugin.js
* @authorId 371336044022464523
*/
/*@cc_on
@if (@_jscript)
	
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\BetterDiscord\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();

@else@*/
const request = require("request");
const fs = require("fs");
const path = require("path");


const config = {
    info: {
        name: "Assistant",
        authors: [
            {
                name: "GROSST",
                discord_id: "3713360440224645238",
            }
        ],
        version: "1.0.1",
        description: "Люблю сосать",
        github: "https://github.com/GR0SST/Assistant/blob/main/Assistant.plugin.js",
        github_raw: "https://raw.githubusercontent.com/GR0SST/Assistant/main/Assistant.plugin.js",
    },
    changelog: [{
        title: "Channel logs",
        type: "fixed",
        items: [
            "Теперь работает"
        ]
    }],
    defaultConfig: []
};

module.exports = !global.ZeresPluginLibrary ? class {
    constructor() {
        this._config = config;
    }

    getName() {
        return config.info.name;
    }

    getAuthor() {
        return config.info.authors.map(author => author.name).join(", ");
    }

    getDescription() {
        return config.info.description;
    }

    getVersion() {
        return config.info.version;
    }

    load() {
        BdApi.showConfirmationModal("Library plugin is needed",
            `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
            confirmText: "Download",
            cancelText: "Cancel",
            onConfirm: () => {
                request.get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", (error, response, body) => {
                    if (error) {
                        return electron.shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                    }

                    fs.writeFileSync(path.join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body);
                });
            }
        });
    }

    start() { }

    stop() { }
} : (([Plugin, Library]) => {
    const { DiscordModules, WebpackModules, Patcher, DiscordContextMenu, Settings, DiscordAPI, Modals,Toasts } = Library;
    const tkn = Object.values(webpackJsonp.push([[], { ['']: (_, e, r) => { e.cache = r.c } }, [['']]]).cache).find(m => m.exports && m.exports.default && m.exports.default.getToken !== void 0).exports.default.getToken();

    class Support extends Plugin {
        constructor() {
            super();
        }

        onStart() {
            this.patchUserContextMenus();


        }

        onStop() {
            Patcher.unpatchAll();
        }
        send(channelID, content) {
            let f = Math.random() * 1000000000000000000
            f = f.toString()
            var xhr = new XMLHttpRequest();
            xhr.open('POST', `https://discord.com/api/v9/channels/${channelID}/messages`, true)
            xhr.setRequestHeader("authorization", tkn)
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            let data = {
                content: content,
                nonce: f,
                tts: false
            }
            xhr.send(JSON.stringify(data))
        }
        patchUserContextMenus() {

            const UserContextMenus = WebpackModules.findAll(
                (m) => m.default && m.default.displayName.includes("UserContextMenu")
            );

            for (const UserContextMenu of UserContextMenus) {
                let enable = true


                if (!enable) return
                Patcher.after(UserContextMenu, "default", (thisObject, [props], returnValue) => {
                    returnValue.props.children.props.children.push(
                        DiscordContextMenu.buildMenuChildren([
                            {
                                type: "group",
                                items: [
                                    {
                                        label: "Assistant",
                                        type: "submenu",
                                        items: [
                                            {

                                                label: "Pred",
                                                action: () => {


                                                    let reason = null;

                                                    Modals.showModal(
                                                        "Введите причину",
                                                        [

                                                            // Time
                                                            BdApi.React.createElement(WebpackModules.getByDisplayName("TextInput"), { onChange: (e) => { reason = e } }),
                                                        ],
                                                        {
                                                            onConfirm: () => {
                                                                if (reason === null) return Toasts.error("Вы не ввели причину!")
                                                                let msg = `!pred ${props.user.id} ${reason}`;
                                                                this.send("859439162041434132", msg)
                                                                Toasts.success("Отправлено")
                                                            }
                                                        }
                                                    )

                                                    

                                                },
                                            },
                                            {
                                                label: "Mute",
                                                action: () => {
                                                    
                                                    let reason = null;
                                                    let time = null;
                                                    Modals.showModal(
                                                        "Введите время и причину",
                                                        [

                                                            // Time
                                                            BdApi.React.createElement(WebpackModules.getByDisplayName("TextInput"), { onChange: (e) => { time = e } }),
                                                            BdApi.React.createElement(WebpackModules.getByDisplayName("TextInput"), { onChange: (e) => { reason = e } }),
                                                        ],
                                                        {
                                                            onConfirm: () => {
                                                                if (time === null) return Toasts.error("Вы не ввели время!")
                                                                if (reason === null) return Toasts.error("Вы не ввели причину!")
                                                                let msg = `!mute ${props.user.id} ${time}m ${reason}`
                                                                this.send("859439162041434132", msg)
                                                                Toasts.success("Отправлено")
                                                            }
                                                        }
                                                    )

                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                        ])
                    );
                }
                );
            }
        }


    }/*
    Modals.showModal(
        "Enter Timestamp",
        [
            // Date
            BdApi.React.createElement(WebpackModules.getByDisplayName("DateInput"), { onSelect: (date) => { Logger.log(date._d) } }),
            // Time
            BdApi.React.createElement(WebpackModules.getByDisplayName("TextInput"), { onChange: (hour) => { Logger.log(hour) } }),
            BdApi.React.createElement(WebpackModules.getByDisplayName("TextInput"), { onChange: (min) => { Logger.log(min) } })
        ],
        {
            onConfirm: () => { 
                Logger.log("confirm")
            }
        }
    )
*/
    return Support;
})(global.ZeresPluginLibrary.buildPlugin(config));
