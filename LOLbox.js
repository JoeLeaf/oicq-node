const fetch = require("node-fetch");

/*

使用方法


let Region = "巨神峰"
let str = await getLOLFreeTreasureChest(Region, bot.cookies['game.qq.com'])
str += "\n"
str += await getLOLWalletInformation(Region, bot.cookies['game.qq.com'])

console.log(str)
*/




//领取英雄联盟免费宝箱和查钱包信息

function getCookieValue(cookies, key) {
    var e = new RegExp("(?:^| )" + key + "=([^;]*)(?:;|$)", "gi"),
        n = e.exec(cookies);
    return n ? unescape(n[1]) : ""
}
async function getLOLWalletInformation(name, cookies) { 
    let RegionID = RegionToID(name)
    let QQ = getCookieValue(cookies, "uin").replace("o", "")
    if (!RegionID) {
        return "未知大区"
    }
    console.log(RegionID);
    let url = `https://apps.game.qq.com/daoju/igw/main?_service=pay.midas.dq.get&optype=2&plat=1&app_id=1006&_biz_code=lol&area=${RegionID}&reportUserUin=5837341` + QQ
    let response = await fetch(url, {
        "headers": {
            "cookie": cookies,
        },
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });
    let response_json = await response.json();
    let str = ""
    str += response_json.dq_name + ":" + response_json.dq
    str += "\n"
    str += response_json.jb2_name + ":" + response_json.jb2
    str += "\n"
    str += response_json.jb_name + ":" + response_json.jb
    return str;
}

async function getLOLFreeTreasureChest(name, cookies) {
    let RegionID = RegionToID(name)
    let QQ = getCookieValue(cookies, "uin").replace("o", "")
    if (!RegionID) {
        return "未知大区"
    }
    console.log(RegionID);
    let url = `https://apps.game.qq.com/daoju/igw/main?_service=buy.plug.svr.sysc_ext&paytype=8&iActionId=22565&propid=338943&buyNum=1&_app_id=1006&_plug_id=72007&_biz_code=lol&areaid=${RegionID}&roleid=${QQ}&source=4_0&appext={%22sfileMD5%22:%22c994b8c773c61917396196a674585b57%22}&reportUserUin=` + QQ
    let response = await fetch(url, {
        "headers": {
            "cookie": cookies,
        },
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });
    let response_json = await response.json();
    if (response_json.hasOwnProperty("act_amount")) {
        let msg = JSON.parse(response_json.msg)
        return msg[0].sMsg
    } else {
        return response_json.msg
    }
}

function RegionToID(name) {
    let RegionList = {
        "艾欧尼亚  电信": "1",
        "比尔吉沃特  网通": "2",
        "祖安 电信": "3",
        "诺克萨斯  电信": "4",
        "班德尔城 电信": "5",
        "德玛西亚 网通": "6",
        "皮尔特沃夫 电信": "7",
        "战争学院 电信": "8",
        "弗雷尔卓德 网通": "9",
        "巨神峰 电信": "10",
        "雷瑟守备 电信": "11",
        "无畏先锋 网通": "12",
        "裁决之地 电信": "13",
        "黑色玫瑰 电信": "14",
        "暗影岛 电信": "15",
        "恕瑞玛 网通": "16",
        "钢铁烈阳 电信": "17",
        "水晶之痕 电信": "18",
        "均衡教派": "19",
        "扭曲丛林 网通": "20",
        "教育网专区": "21",
        "影流 电信": "22",
        "守望之海 电信": "23",
        "征服之海 电信": "24",
        "卡拉曼达 电信": "25",
        "巨龙之巢 网通": "26",
        "皮城警备 电信": "27",
        "男爵领域 全网络": "30"
    }
    //判断传入的name是否在RegionList中,如果在则返回RegionList[name],如果不在则返回false,传入的name有可能是缩写,所以需要遍历RegionList
    for (let key in RegionList) {
        if (key.indexOf(name) != -1) {
            return RegionList[key]
        }
    }
    return false
}
