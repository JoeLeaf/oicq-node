// const { pb } = require("icqq/lib/core");
// const { pb } = require("oicq/lib/core");
// 上面二选一，不需要花里胡哨的一大堆配置，我觉得麻烦
// await TXtts("人面不知何处去，桃花依旧笑春风") 返回的是amr音频


async function TXtts(text) {
  const url = "https://textts.qq.com/cgi-bin/tts";
  const params = {
    appid: "201908021016",
    sendUin: parseInt(bot.uin),
    text: text,
  };
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
    let ttsRsp = pb.decode(ttsReader.slice(i, i + length));
    if (ttsRsp["1"] != 0) {
      console.log("can't convert text to voice");
      return;
    }
    if (ttsRsp["4"]) {
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
