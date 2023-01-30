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
        "艾欧尼亚": "1",
        "比尔吉沃特": "2",
        "祖安": "3",
        "诺克萨斯": "4",
        "班德尔城": "5",
        "德玛西亚": "6",
        "皮尔特沃夫": "7",
        "战争学院": "8",
        "弗雷尔卓德": "9",
        "巨神峰": "10",
        "雷瑟守备": "11",
        "无畏先锋": "12",
        "裁决之地": "13",
        "黑色玫瑰": "14",
        "暗影岛": "15",
        "恕瑞玛": "16",
        "钢铁烈阳": "17",
        "水晶之痕": "18",
        "均衡教派": "19",
        "扭曲丛林": "20",
        "教育网专区": "21",
        "影流": "22",
        "守望之海": "23",
        "征服之海": "24",
        "卡拉曼达": "25",
        "巨龙之巢": "26",
        "皮城警备": "27",
        "男爵领域": "30",
        "峡谷之巅": "31"
    }
    if (RegionList[name]) {
        return RegionList[name];
    } else {
        return false;
    }
}
