
//推荐群
async function generateGroupForward(groupID) {
  let body = {
    1: 1,
    2: groupID,
    5: 1,
  };
  body = pb.encode(body);
  const res = pb.decode(await bot.sendUni("GroupSvc.JoinGroupLink", body));
  return {
    url: res["3"].toString(),
    card: res["5"].toString(),
  };
}
//推荐好友
async function generateFriendForward(qq) {
  let body = {
    1: 4790,
    2: 0,
    4: {
      1: parseInt(qq),
      3:
        "mqqapi://card/show_pslcard?src_type=internal&source=sharecard&version=1&uin=" +
        qq,
    },
    6: "android 9.0.56",
  };
  body = core.pb.encode(body);
  const res = pb.decode(await bot.sendUni("OidbSvcTrpcTcp.0x11ca_0", body));
  return res["4"]["1"].toString();
}
//推荐智能体（机器人）
async function generateBot(qq) {
  let body = {
    1: 4788,
    2: 0,
    4: {
      1: parseInt(qq),
    },
    6: "android 9.0.90",
  };
  body = core.pb.encode(body);
  const res = pb.decode(await bot.sendUni("OidbSvcTrpcTcp.0x12b4_0", body));
  console.log(res[4]);
  return res["4"]["1"].toString();
}
