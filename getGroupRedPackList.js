const { pb } = require("@icqqjs/icqq/lib/core");
//新版的取群未领取红包
//传入群号

async function getGroupRedPackList(qun) {
  const body = {
    1: "trpc.qqhb.records.UpForGrabs",
    2: "GetUpForGrabs",
    3: {
      1: String(qun),
    },
    4: {
      1: "cipher",
      2: "plain",
    },
  };
  const response = await bot.sendUni(
    "trpc.qpay.gateway.Gateway.SsoHandle",
    pb.encode(body)
  );
  const rsp = pb.decode(response);
  if (rsp["3"]) {
    rsp["3"] = Array.isArray(rsp["3"]) ? rsp["3"] : [rsp["3"]];
    return rsp["3"].map((item) => {
      const element = item["1"];
      return {
        Sender: element[0],
        Title: String(element[1]),
        Channel: String(element[2]),
        Listid: String(element[3]),
        Authkey: String(element[4]),
      };
    });
  } else {
    return "没有未领取的红包";
  }
}
