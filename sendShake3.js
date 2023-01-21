const { core } = require("oicq")
const crypto = require('crypto');
//22,26,33,35可以自己传递值进去,我没有表情的表,我直接固定,懒就完了

async function sendShake3(source_group_id, id, num) {
    let body = {
        "1": {
            "2": {
                "1": source_group_id
            }
        },
        "2": {
            "1": 0,
            "2": 0,
            "3": 0
        },
        "3": {
            "1": {
                "2": [
                    {
                        "53": {
                            "1": 23,
                            "2": {
                                "1": id,
                                "2": num,
                                "3": "xyz"
                            },
                            "3": id
                        }
                    },
                    {
                        "1": {
                            "1": "[xyz]",
                            "12": {
                                "1": "[略略略]小叶子提示你,你需要手机最新版看这个消息!"
                            }
                        }
                    },
                    {
                        "37": {
                            "17": 0,
                            "19": {
                                "15": 0,
                                "31": 0,
                                "41": 0
                            }
                        }
                    }
                ]
            }
        },
        "4": crypto.randomBytes(2).readUInt16BE(),
        "5": crypto.randomBytes(4).readUInt16BE(),
        "8": 0
    }
    body = core.pb.encode(body)
    await bot.sendUni("MessageSvc.PbSendMsg", body);
}
