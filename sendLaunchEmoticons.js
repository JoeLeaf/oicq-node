const { core } = require("oicq")
const crypto = require('crypto');
//还是老问题,我没有去抓数据存,所以我不知道表情id对应的名字,只写实现

//这个只能私聊发
//[表情弹射]请使用最新版本手机QQ体验新功能
//就是这玩意,会满屏幕表情那玩意


async function sendLaunchEmoticons(QQ, id, num) {
    let body = {
        "1": {
            "1": {
                "1": QQ
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
                                "1": 13,
                                "2": num,
                                "3": "小叶子",
                                "6": {
                                    "1": id,
                                    "2": "小叶子",
                                    "3": "小叶子"
                                }
                            },
                            "3": 13
                        }
                    },
                    {
                        "1": {
                            "1": "[小叶子]x数量",
                            "12": {
                                "1": "[小叶子]请使用最新版手机QQ体验新功能。"
                            }
                        }
                    },
                    {
                        "37": {
                            "17": 21908,
                            "19": {
                                "15": 65536,
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
    };
    body = core.pb.encode(body)
    await bot.sendUni("MessageSvc.PbSendMsg", body);
}
