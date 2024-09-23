// const { pb } = require("icqq/lib/core");
// const { pb } = require("oicq/lib/core");
// 上面二选一，不需要花里胡哨的一大堆配置，我觉得麻烦
//返回音频文件为腾讯的slik_v3

/*
这个支持智能体声音
const tts = await TXtts("我觉得这个世上这么多人，可是没有人想听我讲话。", {
  autoTTS: 0,
  businessID: 2,
  clientVersion: "AND_537242082_9.0.95",
  model: 1,
  net: 1,
  seq: 0,
  sendUin: 3889008584,
  voiceType: "dreamer-linwaner",
  });
if (typeof tts == "string") {
  this.reply(tts, true);
} else {
  this.reply([segment.record(tts)]);
}

如果要智能体可以这样传入第二个值，如果不要，只传入文本即可
*/
async function TXtts(text, voiceType = {}) {
  const url = "https://textts.qq.com/cgi-bin/tts";
  let params = {
    appid: "201908021016",
    sendUin: 0,
    text: text,
    uin: parseInt(bot.uin),
  };
  params = { ...params, ...voiceType };
  console.log(params);
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(params),
    headers: {
      "Content-Type": "application/json",
      Cookie: `uin=${bot.uin}; skey=${bot.sig.skey.toString()};`,
    },
  });
  const buffer = Buffer.from(await response.arrayBuffer());
  const ttsReader = buffer;
  let ttsWriter = Buffer.alloc(0);
  for (let i = 0; i < ttsReader.length; ) {
    let dataLen = [];
    for (let j = i; j < ttsReader.length; j++) {
      if (ttsReader[j] == 0x0d) {
        i = j + 2;
        break;
      }
      dataLen.push(ttsReader[j]);
    }
    let length = parseInt("0x" + Buffer.from(dataLen).toString());
    if (length == 0) {
      break;
    }
    let ttsRsp = pb.decode(ttsReader.subarray(i, i + length));
    if (ttsRsp["1"] != 0) {
      console.log(ttsRsp["11"].toString());
      return ttsRsp["11"].toString();
    }
    if (ttsRsp["4"]) {
      ttsRsp["4"] = Array.isArray(ttsRsp["4"]) ? ttsRsp["4"] : [ttsRsp["4"]];
      for (let voiceItem of ttsRsp["4"]) {
        ttsWriter = Buffer.concat([ttsWriter, voiceItem["1"].encoded]);
      }
    }
    i += length + 2;
  }
  let ret = ttsWriter;
  ret[0] = 0x02;
  return ret;
}
