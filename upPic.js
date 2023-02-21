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
