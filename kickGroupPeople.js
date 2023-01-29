const { core } = require("oicq")

// 群号,目标QQ,消息,是否拉黑
//  可以踢人并发送踢人理由(消息)

async function kickGroupPeople(qun, qq, msg, block=true) { 
    let body = {
        "1": 2208,
        "2": 0,
        "3": 0,
        "4": {
            "1": qun,
            "2": {
                "1": 5,
                "2": qq,
                "3": block ? 1 : 0
            },
            "5": msg
        }
    }
    body = core.pb.encode(body)
    await bot.sendUni("OidbSvc.0x8a0_0", body);
}
