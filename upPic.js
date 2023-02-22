//用于做图床,或者卡片限制之类的

async function upPicturesToQz(cookies, picture_base64) {
    const uin = getCookieValue(cookies, "uin")
    const skey = getCookieValue(cookies, "skey")
    const p_uin = getCookieValue(cookies, "p_uin")
    const p_skey = getCookieValue(cookies, "p_skey")
    const upQzUrl = "https://up.qzone.qq.com/cgi-bin/upload/cgi_upload_image?g_tk=" + getG_TK(p_skey) + "&&g_tk=" + getG_TK(p_skey)
    picture_base64 = encodeURIComponent(picture_base64)
    const htmlData = await fetch(upQzUrl, {
        "headers": {
            "accept": "*/*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Microsoft Edge\";v=\"108\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site"
        },
        "referrer": "https://user.qzone.qq.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "filename=filename&uin=" + p_uin + "&skey=" + skey + "&zzpaneluin=" + p_uin + "&zzpanelkey=&p_uin=" + p_uin + "&p_skey=" + p_skey + "&qzonetoken=&uploadtype=1&albumtype=7&exttype=0&refer=shuoshuo&output_type=jsonhtml&charset=utf-8&output_charset=utf-8&upload_hd=1&hd_width=2048&hd_height=10000&hd_quality=96&backUrls=&url=&base64=1&jsonhtml_callback=callback&picfile=" + picture_base64 + "&qzreferrer=https%3A%2F%2Fuser.qzone.qq.com%2F" + p_uin + "%2Finfocenter",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    })
    const regex = /"origin_url":"(.*?)"/;
    const htmlText = await htmlData.text();
    const match = htmlText.match(regex);
    console.log(match[1]);
    return match[1]
}
//高清域名地址:http://r.photo.store.qq.com/





async function upPicTxc(pic, cookie) {
    //判断pic是否是blob
    if (!pic instanceof Blob)
        return "pic不是blob";
    //读取pic的文件名和文件类型
    let fileName = "xyz." + pic.type.match(/\/(\w+)$/)[1];
    //创建formData
    let formData = new FormData();
    //添加参数
    formData.append('type', 'reply');
    formData.append('upload', pic, fileName);
    //发送请求
    let res = await fetch("https://support.qq.com/api/v1/" + 108995 +"/posts/upload/images", {
        "headers": {
            "cookie": cookie,
            "Referer": "https://support.qq.com/product/" + 108995,
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": formData,
        "method": "POST"
    });
    //108995可以换点,解决上传频繁
    //获取返回的json
    let json = await res.json();
    //判断json.data是数组还是对象
    if (json.data instanceof Array)
        return "上传失败" + json.message;
    return json.data.image_url;
}
//https://txc.gtimg.com/data/507956/2023/0219/d890ccbd40a0db411bc3862295519757.jpeg
//https://txc.qq.com/data/507956/2023/0219/d890ccbd40a0db411bc3862295519757.jpeg
//把gtimg替换为qq
/*
使用方法

const response = await fetch(图片url, { method: 'GET' });
const contentType = response.headers.get('content-type');
const buffer = await response.arrayBuffer();

//把图片buffer塞进Blob,blob是node18之后的,因为18之后的formData只能塞blob......
const pic = new Blob([buffer], { type: contentType });
const url = await upPicTxc(pic, "_tucao_session=xxxxx")

*/

async function upGroupjobPic(qun_cookies, pic_base64) {
    const skey = getCookieValue(qun_cookies, "skey")
    let url = "https://qun.qq.com/cgi-bin/hw/util/image"
    let response = await fetch_a(url, {
        credentials: 'include',
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': '*/*',
            cookie: qun_cookies,
            'origin': 'https://qun.qq.com',
            'referer': 'https://qun.qq.com/homework/p/features/index.html',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) QQ/9.7.1.28934 Chrome/43.0.2357.134 Safari/537.36 QBCore/3.43.1298.400 QQBrowser/9.0.2524.400'
        },
        body: "pic=" + encodeURIComponent(pic_base64) + "&client_type=1&bkn=" + getG_TK(skey),
    })
    return await response.json()
}
/*
http://p.qpic.cn/
*/

async function upPicMail(url, sid) {
    const response = await fetch(url, { method: 'GET' });
    const contentType = response.headers.get('content-type');
    let fileName = "xyz." + contentType.match(/\/(\w+)$/)[1];
    const pic = await response.arrayBuffer();
    let res = await fetch(`https://mail.qq.com/cgi-bin/note_upload?t=qmfileuploadnew&ef=qdata&sid=${sid.qm_sid}&resp_charset=UTF8&mode=file&widthlimit=0&heightlimit=0&sizelimit=0&type=upfile&filetype=pic&business=notebook`, {
        "headers": {
            "content-type": "application/octet-stream",
            "x-qqmail-filename": fileName,
            "cookie": "sid=" + sid.sid,
            "Referer": "https://mail.qq.com/",
            "Referrer-Policy": "origin",
        },
        "body": pic,
        "method": "POST"
    });
    res = await res.text();
    let viewfileurl = res.match(/viewfileurl="(.+?)"/)[1];
    return viewfileurl;
}
async function getMailSid(mailCookies) {
    const loginWapUrl = "https://wap.mail.qq.com/login/login?auth_type=3&qq_target="
    const res = await fetch(loginWapUrl, {
        "headers": {
            "cookie": mailCookies,
        },
        "method": "GET",
        "redirect": "manual"
    });
    let loginCK = res.headers.get("set-cookie");
    const xm_skey = "xm_skey=" + loginCK.match(/xm_skey=(.*?);/)[1];
    const loginSid = res.headers.get("Location").match(/sid=(\w+)/)[1];
    let SidUrl = `https://wap.mail.qq.com/login/exchangeticket?sid=${loginSid}&r=0&func=10`
    const res1 = await fetch(SidUrl, {
        "headers": {
            "cookie": xm_skey,
        },
        "method": "GET",
        "redirect": "manual"
    });
    const cookie1 = res1.headers.get("set-cookie");
    cookie1.replace(/qm_muti_sid=(.*?);/, "");
    const sid = cookie1.match(/sid=(.*?);/)[1];
    let json = await res1.json();
    const qm_sid = json.body.qm_sid;
    return {
        "sid": sid,
        "qm_sid": qm_sid
    };
}

//使用方法
/*
const mail_cookies = bot.cookies['mail.qq.com']
const sid = await getMailSid(mail_cookies)
const url= await upPicMail(图片url,sid)

http://p.qlogo.cn/
*/









