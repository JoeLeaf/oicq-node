/*
每天定时签到
*/
const cron = require('node-cron');
cron.schedule('1 0 * * *', async () => {
    try {
        let qun = client.pickGroup(148651459);
        const vip_cookies = bot.cookies['vip.qq.com']
        await qun.sendMsg(await Points_SignIn(vip_cookies));
    } catch {
        console.log("xyz:定时任务有问题哦~");
    }
});

/*
漏洞领取每月会员当前和以下等级积分

1.写死法
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
const qzone_cookies = bot.cookies['qzone.qq.com']
SubmitHD(qzone_cookies,arr)

2.动态法
const qzone_cookies = bot.cookies['qzone.qq.com']
const arr = await analyseJS("https://act.qzone.qq.com/v2/vip/tx/p/43049_4985e602?_wv=16777218&_wwv=8192", qzone_cookies)
const arr2 = await SubmitHD(qzone_cookies, arr)

返回参数

[
  '月度奖励-SVIP1',
  '月度奖励-SVIP10',
  '月度奖励-SVIP9',
  '月度奖励-SVIP8',
  '月度奖励-SVIP7',
  '月度奖励-SVIP6',
  '月度奖励-SVIP5',
  '月度奖励-SVIP4',
  '月度奖励-SVIP3',
  '月度奖励-SVIP2'
]



*/








async function Points_SignIn(cookie) {
    const p_skey = getCookieValue(cookie, "p_skey")
    const g_tk = getG_TK(p_skey)
    const hdUrl = "https://club.vip.qq.com/qqvip/vip-score/sign-in?_wwv=68&_wv=16777221"
    const response = await fetch(hdUrl, {
        "headers": {
            "cookie": cookie,
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; BLA-AL00 Build/HUAWEIBLA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/98.0.4758.102 MQQBrowser/6.2 TBS/046331 Mobile Safari/537.36 V1_AND_SQ_8.9.28_3700_YYB_D QQ/8.9.28.10155 NetType/WIFI WebP/0.3.0 AppId/537147618 Pixel/1080 StatusBarHeight/73 SimpleUISwitch/1 QQTheme/2971 StudyMode/0 CurrentMode/1 CurrentFontScale/1.0 GlobalDensityScale/0.90000004 AllowLandscape/false InMagicWin/0 Edg/109.0.0.0'
        },
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });
    const html_text = await response.text();
    const signRule = `["` + html_text.match(/signRule\":\"(.*?)\"/)[1] + `"]`;
    const signRule_base64 = Buffer.from(signRule).toString('base64');
    const getUrl = `https://club.vip.qq.com/qqvip/api/vip-score/ExecAct?g_tk=${g_tk}&isomorphism-args=` + signRule_base64
    const response2 = await fetch(getUrl, {
        "headers": {
            "cookie": cookie,
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; BLA-AL00 Build/HUAWEIBLA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/98.0.4758.102 MQQBrowser/6.2 TBS/046331 Mobile Safari/537.36 V1_AND_SQ_8.9.28_3700_YYB_D QQ/8.9.28.10155 NetType/WIFI WebP/0.3.0 AppId/537147618 Pixel/1080 StatusBarHeight/73 SimpleUISwitch/1 QQTheme/2971 StudyMode/0 CurrentMode/1 CurrentFontScale/1.0 GlobalDensityScale/0.90000004 AllowLandscape/false InMagicWin/0 Edg/109.0.0.0'
        },
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });
    const response2_json = await response2.json();
    if (response2_json.data.code == 0) {
        return response2.data.data.op[0].packet[0].widgets[0].name
    } else {
        return response2_json.data.msg
    }
}
async function analyseJS(hdUrl, cookie) {
    const response = await fetch(hdUrl, {
        "headers": {
            "cookie": cookie,
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; BLA-AL00 Build/HUAWEIBLA-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/98.0.4758.102 MQQBrowser/6.2 TBS/046331 Mobile Safari/537.36 V1_AND_SQ_8.9.28_3700_YYB_D QQ/8.9.28.10155 NetType/WIFI WebP/0.3.0 AppId/537147618 Pixel/1080 StatusBarHeight/73 SimpleUISwitch/1 QQTheme/2971 StudyMode/0 CurrentMode/1 CurrentFontScale/1.0 GlobalDensityScale/0.90000004 AllowLandscape/false InMagicWin/0 Edg/109.0.0.0'
        },
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
    });
    const response_text = await response.text();
    const jsUrl = `https://tianxuan.gtimg.cn/` + response_text.match(/tianxuan.gtimg.cn\/(.*?)bundle.js/)[1] + `bundle.js`
    const response2 = await fetch(jsUrl, { "method": "GET" });
    const response2_text = await response2.text();
    const subActId = response2_text.match(/subActId:.(.*?)",/g)
    let subActId_list = []
    for (let i = 0; i < subActId.length; i++) {
        subActId_list.push(subActId[i].match(/subActId:.(.*?)",/)[1])
    }
    subActId_list = subActId_list.filter(function (element, index, self) {
        return self.indexOf(element) === index;
    })
    return subActId_list;
}
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
function getG_TK(p_skey) {
    var t = p_skey,
        e = 5381;
    if (!t)
        return "";
    for (var n = 0; n < t.length; n++)
        e += (e << 5) + t.charCodeAt(n);
    return 2147483647 & e
}
function getCookieValue(cookies, key) {
    var e = new RegExp("(?:^| )" + key + "=([^;]*)(?:;|$)", "gi"),
        n = e.exec(cookies);
    return n ? unescape(n[1]) : ""
}
