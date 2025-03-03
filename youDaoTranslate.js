const crypto = require("crypto");


/*
console.log(await youDaoTranslate("秋风不燥，时光不老，岁月静好，你我都好"));
{
    "code": 0,
    "dictResult": {},
    "translateResult": [
        [
            {
                "tgt": "The autumn wind is not dry, time is not old, years are quiet, you and I are good",
                "src": "秋风不燥，时光不老，岁\n月静好，你我都好",
                "srcPronounce": "qiū fēng bù zào, shí guāng bù lăo, suì yuè jìng hăo, nĭ wŏ dōuhăo"
            }
        ]
    ],
    "type": "zh-CHS2en"
}
*/

function youDaoSign(o, e) {
  return _md5(`client=fanyideskweb&mysticTime=${o}&product=webfanyi&key=${e}`)
}
function _md5(content) {
  return crypto.createHash("md5").update(content).digest("hex").toUpperCase();
}
async function youDaoTranslate(text) {
  const o = new Date().getTime();
  const bodyJson = {
    "i": text,
    "from": "auto",
    "to": "",
    "useTerm": "false",
    "dictResult": "true",
    "keyid": "webfanyi",
    "sign": youDaoSign(o, "Vy4EQ1uwPkUoqvcP1nIu6WiAjxFeA3Y1"),
    "client": "fanyideskweb",
    "product": "webfanyi",
    "appVersion": "1.0.0",
    "vendor": "web",
    "pointParam": "client,mysticTime,product",
    "mysticTime": o,
    "keyfrom": "fanyi.web",
    "mid": "1",
    "screen": "1",
    "model": "1",
    "network": "wifi",
    "abtest": "0",
    "yduuid": "abcdefg"
  }
  const res = await fetch("https://dict.youdao.com/webtranslate", {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Referer: "https://fanyi.youdao.com/",
      cookie:
        "OUTFOX_SEARCH_USER_ID_NCOO=1; OUTFOX_SEARCH_USER_ID=-1@127.0.0.1",
    },
    body: new URLSearchParams(bodyJson).toString(),
    method: "POST",
  });
  const resBase64 = await res.text();
  const key = Buffer.from("08149da73c59ce62555b01e92f34e838", "hex");
  const iv = Buffer.from("d2bb1bfde83b38c344366357b79cae1c", "hex");
  const r = crypto.createDecipheriv("aes-128-cbc", key, iv);
  let s = r.update(resBase64, "base64", "utf-8");
  return (s += r.final("utf-8"));
}

