
/*
群内扫码登录QQ空间(可异地),通过漏洞刷取SVIP当前等级和以下的所有会员积分

使用方法


            const login = await login_QZ()
            const message = [
                segment.image('base64://' + login.src),
                "请尽快登录哦~否则会过期的!",
            ]
            await data.reply(message, true)
            let check=""
            while (true) {
                check = await check_QZ(login.qrsig)
                if (check.code != 66 && check.code != 67) {
                    await data.reply(check.msg, true)
                    break
                }
                sleep(1000)
            }
            if (check.code == 0) {
                if (getCookieValue(check.cookies, "uin").replace(/o/,"")!=data.user_id) {
                    return data.reply("点名批评" + getCookieValue(check.cookies, "uin") + ",你他妈扫别人二维码干嘛?")
                }
                const qzone_cookies = "uin=" + getCookieValue(check.cookies, "uin") + "; skey=" + getCookieValue(check.cookies, "skey") + "; p_uin=" + getCookieValue(check.cookies, "uin") + "; p_skey=" + getCookieValue(check.cookies, "p_skey") + ";"
                const arr = [
                    '72596_c72fd289',
                    '72605_27b0ab37',
                    '72604_c4d6e5ae',
                    '72603_a5b11fa6',
                    '72602_56d099dd',
                    '72601_6413fa8f',
                    '72600_07e9df8b',
                    '72599_2eac5a26',
                    '72598_b6da2298',
                    '72597_de7d1565'
                ]
                const arr2 = await SubmitHD(qzone_cookies, arr)
                await data.reply(JSON.stringify(arr2, null, "\t") +"\n\n查看请打开:https://act.qzone.qq.com/v2/vip/tx/p/43049_4985e602?_wv=16777218&_wwv=8192",true)
                
*/

async function SubmitHD(cookies, subActId, num = 1, type = 1, qq = "", url = "") {
    const p_skey = getCookieValue(cookies, "p_skey")
    const g_tk = getG_TK(p_skey)
    let body = {
        "ActReqData": "",
        "SubActId": ""
    }
    if (url == "") {
        url = "https://act.qzone.qq.com/v2/vip/tx/trpc/subact/ExecAct?g_tk=" + g_tk
    } else {
        url = url.replace("xyz_gtk", g_tk)
        url = url.replace("xyz_qq", qq)
    }
    if (qq != "") {
        body.ActReqData = '{\"receivers\":[\"' + String(qq) + '\"]}'
    } else {
        body.ActReqData = '{}'
    }
    let str = []
    for (let i = 0; i < num; i++) {
        for (let j = 0; j < subActId.length; j++) {
            body.SubActId = subActId[j]
            if (type == 1) {
                const response = await fetch(url, {
                    "headers": {
                        "Content-Type": "application/json;charset=UTF-8",
                        "cookie": cookies,
                        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; BLA-AL00 Build/HUAWEIBLA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/98.0.4758.102 MQQBrowser/6.2 TBS/046331 Mobile Safari/537.36 V1_AND_SQ_8.9.28_3700_YYB_D QQ/8.9.28.10155 NetType/WIFI WebP/0.3.0 AppId/537147618 Pixel/1080 StatusBarHeight/73 SimpleUISwitch/1 QQTheme/2971 StudyMode/0 CurrentMode/1 CurrentFontScale/1.0 GlobalDensityScale/0.90000004 AllowLandscape/false InMagicWin/0 Edg/109.0.0.0'
                    },
                    "body": JSON.stringify(body),
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "include",
                });
                const res_json = await response.json();
                if (res_json.Code == 0) {
                    let data = res_json.Data
                    let name = data.match(/name\":\"(.*?)\"/)[1]
                    str.push(name)
                } else if (res_json.message) {
                    str.push(res_json.message)
                } else {
                    str.push(res_json.Msg)
                }
            }
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    console.log(str);
    return str;
}

async function login_QZ() {
    let login = {
        "src": "",
        "qrsig": "",
    }
    let time = new Date().getTime()
    time = time.toString().substr(0, 10)
    const url = `https://ssl.ptlogin2.qq.com/ptqrshow?appid=716027609&e=2&l=M&s=4&d=72&v=4&t=0.5409099${time}&daid=5&pt_3rd_aid=100384226`
    const res = await fetch(url, { "method": "GET", "redirect": "manual", "headers": { "Referer": "https://xui.ptlogin2.qq.com/cgi-bin/xlogin?daid=5&hide_title_bar=1&low_login=0&qlogin_auto_login=1&no_verifyimg=1&link_target=blank&target=self&s_url=https:%2F%2Fqzs.qq.com%2Fqzone%2Fv5%2Floginsucc.html?para%3Dizone&pt_no_auth=0&appid=716027609&pt_3rd_aid=100384226" } })
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
    const url = `https://ssl.ptlogin2.qq.com/ptqrlogin?u1=https%3A%2F%2Fqzs.qq.com%2Fqzone%2Fv5%2Floginsucc.html%3Fpara%3Dizone&ptqrtoken=${getqrtoken(qrsig)}&ptredirect=0&h=1&t=1&g=1&from_ui=1&ptlang=2052&action=0-0-${time}0000&js_ver=21073010&js_type=1&login_sig=&pt_uistyle=40&aid=716027609&daid=5&pt_3rd_aid=100384226&`
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
        const Referer = "https://qzs.qq.com/qzone/v5/loginsucc.html?para=izone&f_url=&ptlang=2052&ptredirect=100&aid=716027609&daid=5&j_later=0&low_login_hour=0&regmaster=0&pt_login_type=3&pt_aid=0&pt_aaid=16&pt_light=0&pt_3rd_aid=100384226"
        let response = await fetch(url, { "headers": { "cookie": cookies, "Referer": Referer }, "method": "GET", "redirect": "manual" })
        cookies += response.headers.get("set-cookie").split(";,").map((item) => { return item.split(";")[0] }).join(";") + ";"
        cookies = cookies.split(";").filter((item, index, arr) => { return arr.indexOf(item) == index }).join(";")
        await fetch("https://qzs.qq.com/qzone/v5/loginsucc.html?para=izone&f_url=&ptlang=2052&ptredirect=100&aid=716027609&daid=5&j_later=0&low_login_hour=0&regmaster=0&pt_login_type=3&pt_aid=0&pt_aaid=16&pt_light=0&pt_3rd_aid=100384226", { "headers": { "cookie": cookies, "Referer": url }, "method": "GET", "redirect": "manual" })
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
