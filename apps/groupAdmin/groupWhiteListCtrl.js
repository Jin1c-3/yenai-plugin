import { common } from "../../model/index.js"
import { Config } from "../../components/index.js"

export class groupWhiteListCtrl extends plugin {
  constructor() {
    super({
      name: "椰奶群管-白名单",
      event: "message.group",
      priority: 500,
      rule: [
        {
          reg: "^#?群管(加|删)白(名单)?",
          fnc: "whiteQQ"
        },
        {
          reg: "^#?(开启|关闭)白名单(自动)?解禁",
          fnc: "noBan"
        }
      ]
    })
  }

  /**
   * 加白名单
   * @param
   */
  async whiteQQ() {
    if (!common.checkPermission(this.e, "master")) return

    let type = /加/.test(this.e.msg) ? "add" : "del"
    let qq = this.e.at || (this.e.msg.match(/\d+/)?.[0] || "")
    qq = Number(qq) || String(qq)

    if (!qq) return this.reply("❎ 请艾特或输入需要加白的QQ")

    const { whiteQQ } = Config.groupAdmin
    const isWhite = whiteQQ.includes(qq)

    if (isWhite && type === "add") return this.reply("❎ 此人已在群管白名单内")
    if (!isWhite && type === "del") return this.reply("❎ 此人未在群管白名单中")

    Config.modifyarr("groupAdmin", "whiteQQ", qq, type)
    this.reply(`✅ 已${type === "add" ? "加入" : "删除"}${qq}到群管白名单`)
  }

  /**
   * 开关白名单自动解禁
   * @param
   */
  async noBan() {
    if (!common.checkPermission(this.e, "master")) return
    let type = !!/开启/.test(this.e.msg)

    const { noBan } = Config.groupAdmin
    if (noBan && type) return this.reply("❎ 白名单自动解禁已处于开启状态")
    if (!noBan && !type) return this.reply("❎ 白名单自动解禁已处于关闭状态")

    Config.modify("groupAdmin", "noBan", type)
    this.reply(`✅ 已${type ? "开启" : "关闭"}白名单自动解禁`)
  }
}
