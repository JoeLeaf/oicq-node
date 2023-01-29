const { core } = require("oicq")
//tenpay.com 的cookies需要通过特殊办法获得,也可参照 https://github.com/JoeLeaf/OICQ-node/blob/main/%E7%89%B9%E6%AE%8ACookies%E8%8E%B7%E5%8F%96.txt

//8.9.28.3700是版本号,可以改成框架同版本,但是我懒得查是啥方法.....




async function getGroupRedPackList(qun) {
    const tenpay_cookies = bot.cookies['tenpay.com']
    let skey = getCookieValue(tenpay_cookies, 'skey')
    const req = core.jce.encodeStruct([String(qun), 1, "8.9.28.3700", 1, String(bot.uin), skey, ""])
    const getGroupRedPackList = core.jce.encodeWrapper(
        { req },
        "Wallet.GroupRedPackListServer.GroupRedPackListObj",
        "getGroupRedPackList"
    )
    const response = await bot.sendUni("GroupRedPackListSvc.getGroupRedPackList", getGroupRedPackList)
    let jce = core.jce.decode(response);
    let rsp = core.jce.decode(jce[7])[0].rsp
    let decodeRsp = core.jce.decode(rsp)
    let str = ""
    if (decodeRsp[0][1] == 0) {
        return "没有未领取的红包"
    } else {
        let HBnum = decodeRsp[0][1]
        str = []
        for (let i = 0; i < HBnum; i++) {
            const element = decodeRsp[0][2][i];
            str.push({
                "Sender": element[0],
                "Title": element[1],
                "Channel": element[2],
                "Listid": element[3],
                "Authkey": element[4]
            })
        }
        return str
    }
}
function getCookieValue(cookies, key) {
    var e = new RegExp("(?:^| )" + key + "=([^;]*)(?:;|$)", "gi"),
        n = e.exec(cookies);
    return n ? unescape(n[1]) : ""
}
