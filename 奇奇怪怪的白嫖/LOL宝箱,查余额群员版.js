
/*
使用方法
login_QZ这里登录空间的权限很高可以用来刷

            const login = await login_QZ()
            const message = [
                segment.image('base64://' + login.src),
                "请尽快登录哦~否则会过期的!",
            ]
            await data.reply(message, true)
            let check = ""
            while (true) {
                check = await check_QZ(login.qrsig)
                if (check.code != 66 && check.code != 67) {
                    await data.reply(check.msg, true)
                    break
                }
                sleep(1000)
            }
            if (check.code == 0) {
                if (getCookieValue(check.cookies, "uin").replace(/o/, "") != data.user_id) {
                    return data.reply("点名批评" + getCookieValue(check.cookies, "uin") + ",你他妈扫别人二维码干嘛?")
                }
                const game_cookie = "uin=" + getCookieValue(check.cookies, "uin") + "; skey=" + getCookieValue(check.cookies, "skey") + "; p_uin=" + getCookieValue(check.cookies, "uin") + "; p_skey=" + getCookieValue(check.cookies, "p_skey") + ";"
                let array = {
                    "1": "艾欧尼亚  电信",
                    "2": "比尔吉沃特  网通",
                    "3": "祖安 电信",
                    "4": "诺克萨斯  电信",
                    "5": "班德尔城 电信",
                    "6": "德玛西亚 网通",
                    "7": "皮尔特沃夫 电信",
                    "8": "战争学院 电信",
                    "9": "弗雷尔卓德 网通",
                    "10": "巨神峰 电信",
                    "11": "雷瑟守备 电信",
                    "12": "无畏先锋 网通",
                    "13": "裁决之地 电信",
                    "14": "黑色玫瑰 电信",
                    "15": "暗影岛 电信",
                    "16": "恕瑞玛 网通",
                    "17": "钢铁烈阳 电信",
                    "18": "水晶之痕 电信",
                    "19": "均衡教派",
                    "20": "扭曲丛林 网通",
                    "21": "教育网专区",
                    "22": "影流 电信",
                    "23": "守望之海 电信",
                    "24": "征服之海 电信",
                    "25": "卡拉曼达 电信",
                    "26": "巨龙之巢 网通",
                    "27": "皮城警备 电信",
                    "30": "男爵领域 全网络"
                }
                let str = ""
                for (let i = 1; i < 31; i++) {
                    if (array[i]) {
                        const element = array[i];
                        let test = await getLOLFreeTreasureChest(element, game_cookie)
                        if (test.indexOf("角色列表为空") == -1) {
                            str += "大区:" + element + "\n"
                            str += test
                            str += "\n\n"
                        }
                        sleep(1000)
                    }
                }
                str += "其他大区无角色"
                await data.reply(str, true)
            }
            
            
            
 如果是查余额
 
 把for循环部分改成
 
                let str = ""
                for (let i = 1; i < 31; i++) {
                    if (array[i]) {
                        const element = array[i];
                        let test = await getLOLWalletInformation(element, game_cookie)
                        if (test != "点券:0\n橙色精粹:0\n蓝色精粹:0") {
                            str += "大区:" + element + "\n"
                            str += test
                            str += "\n\n"
                        }
                        sleep(1000)
                    }
                }
                str += "其他大区无角色或无余额"
                await data.reply(str, true)
                
*/



async function login_QZ() {
    let login = {
        "src": "",
        "qrsig": "",
    }
    let time = new Date().getTime()
    time = time.toString().substr(0, 10)
    const url = `https://ssl.ptlogin2.qq.com/ptqrshow?appid=549000912&e=2&l=M&s=3&d=72&v=4&t=0.775165${time}&daid=5&pt_3rd_aid=0&u1=https://qzs.qq.com/qzone/v5/loginsucc.html?para=izone`
    const res = await fetch(url, { "method": "GET", "redirect": "manual", "headers": { "Referer": "https://xui.ptlogin2.qq.com/" } })
    const cookies = res.headers.get("set-cookie")
    const qrsig = getCookieValue(cookies, "qrsig")
    login.qrsig = qrsig
    const img = await res.arrayBuffer()
    login.src = Buffer.from(img).toString('base64')
    return login
}
async function check_QZ(qrsig) {
    let check = {
        "code": 0,
        "msg": "",
    }
    let time = new Date().getTime()
    time = time.toString().substr(0, 10)
    const url = `https://ssl.ptlogin2.qq.com/ptqrlogin?u1=https%3A%2F%2Fqzs.qq.com%2Fqzone%2Fv5%2Floginsucc.html%3Fpara%3Dizone&ptqrtoken=${getqrtoken(qrsig)}&ptredirect=0&h=1&t=1&g=1&from_ui=1&ptlang=2052&action=0-0-${time}0000&js_ver=21073010&js_type=1&login_sig=&pt_uistyle=40&aid=549000912&daid=5&pt_3rd_aid=0&`
    const res = await fetch(url, {
        "headers": {
            "cookie": `qrsig=${qrsig};`
        },
        "method": "GET",
        "redirect": "manual"
    })
    let data = await res.text()
    data = data.match(/\((.*)\)/)[1].replace(/'/g, "").split(',')
    if (data[0] == 0) {
        let cookies = res.headers.get("set-cookie").split(";,").map((item) => { return item.split(";")[0] }).join(";") + ";"
        const url = data[2]
        const uin = url.match(/uin=(\d+)/)[1]
        const Referer = "https://qzs.qq.com/qzone/v5/loginsucc.html?para=izone&f_url=&ptlang=2052&ptredirect=100&aid=549000912&daid=5&j_later=0&low_login_hour=0&regmaster=0&pt_login_type=3&pt_aid=0&pt_aaid=16&pt_light=0&pt_3rd_aid=0"
        let response = await fetch(url, { "headers": { "cookie": cookies, "Referer": Referer }, "method": "GET", "redirect": "manual" })
        cookies += response.headers.get("set-cookie").split(";,").map((item) => { return item.split(";")[0] }).join(";") + ";"
        cookies = cookies.split(";").filter((item, index, arr) => { return arr.indexOf(item) == index }).join(";")
        await fetch("https://qzs.qq.com/qzone/v5/loginsucc.html?para=izone&f_url=&ptlang=2052&ptredirect=100&aid=549000912&daid=5&j_later=0&low_login_hour=0&regmaster=0&pt_login_type=3&pt_aid=0&pt_aaid=16&pt_light=0&pt_3rd_aid=0", { "headers": { "cookie": cookies, "Referer": url }, "method": "GET", "redirect": "manual" })
        await fetch("https://user.qzone.qq.com/" + uin, { "headers": { "cookie": cookies, "Referer": url }, "method": "GET", "redirect": "manual" })
        check.code = 0
        check.msg = "登录成功！"
        check.name = data[5]
        check.uin = uin
        check.cookies = cookies
    } else if (data[0] == 65) {
        check.code = 65
        check.msg = "二维码过期."
    } else if (data[0] == 66) {
        check.code = 66
        check.msg = "二维码未失效."
    } else if (data[0] == 67) {
        check.code = 67
        check.msg = "正在验证二维码."
    } else if (data[0] == 10009) {
        check.code = 10009
        check.msg = "需要手机验证码才能登录，此次登录失败。"
    } else {
        check.code = 1
        check.msg = data[4]
    }
    return check;
}
async function getLOLFreeTreasureChest(name, cookies) {
    let RegionID = RegionToID(name)
    let QQ = getCookieValue(cookies, "uin").replace("o", "")
    if (!RegionID) {
        return "未知大区"
    }
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
async function getLOLWalletInformation(name, cookies) {
    let RegionID = RegionToID(name)
    let QQ = getCookieValue(cookies, "uin").replace("o", "")
    if (!RegionID) {
        return "未知大区"
    }
    let url = `https://apps.game.qq.com/daoju/igw/main?_service=pay.midas.dq.get&optype=2&plat=1&app_id=1006&_biz_code=lol&area=${RegionID}&reportUserUin=5837341` + QQ
    let response = await fetch_a(url, {
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
function getqrtoken(qrsig) {
    var e = 0,
        n = qrsig.length;
    for (var i = 0; i < n; i++) {
        e += (e << 5) + qrsig.charCodeAt(i)
    }
    return 2147483647 & e
}
function getCookieValue(cookies, key) {
	var e = new RegExp("(?:^| )" + key + "=([^;]*)(?:;|$)", "gi"),
		n = e.exec(cookies);
	return n ? unescape(n[1]) : ""
}
function getG_TK(p_skey) {
    var t = p_skey,
        e = 5381;
    if (!t)
        return "";
    for (var n = 0; n < t.length; n++)
        e += (e << 5) + t.charCodeAt(n);
    return 2147483647 & e
}
