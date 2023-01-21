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
//用于一些json卡片域名限制
//高清域名地址:http://r.photo.store.qq.com/
