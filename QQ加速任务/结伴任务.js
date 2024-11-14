//try { await deleteFeed(await feedPublish("小叶子")) } catch { }

async function feedPublish(msg) {
  const pbJson = {
    "1": msg,
    "4": 1
  }
  let rsp = await bot.sendUni("QQStranger.FeedSvr.SsoFeedPublish", core.pb.encode(pbJson));
  return core.pb.decode(rsp)["3"]["1"].toString();
}

async function deleteFeed(feedPublishId) {
  const pbJson = {
    "1": "QQStranger.FeedSvr",
    "2": "DeleteFeed",
    "3": 1,
    "4": {
      "1": feedPublishId
    }
  }
  rsp = await bot.sendUni("trpc.qqstranger.common_proxy.CommonProxy.SsoHandle", core.pb.encode(pbJson));
  return core.pb.decode(rsp)["2"].toString();
}
