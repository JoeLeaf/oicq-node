const { core } = require("oicq")
const crypto = require('crypto');
//25行应该传递表情参数,但是我没有去列数据,而且固定影响
//第30,38,40行,可以传递表情的名字,也可以和我一样
async function sendBigEmoticons(source_group_id, id) {
    let body = {
        1: {
            2: {
                1: source_group_id
            }
        },
        2: {
            1: 0,
            2: 0,
            3: 0
        },
        3: {
            1: {
                2: [
                    {
                        53: {
                            1: 37,
                            2: {
                                1: "1",
                                2: "19",
                                3: id,
                                4: 1,
                                5: 1,
                                6: "",
                                7: "/小叶子",
                                8: "",
                                9: 1
                            },
                            3: 1
                        }
                    }, {
                        1: {
                            1: "/小叶子",
                            12: {
                                1: "[小叶子]咳咳你需要升级一下QQ咯"
                            }
                        }
                    }, {
                        37: {
                            17: 21908,
                            19: {
                                15: 65536,
                                31: 0,
                                41: 0
                            }
                        }
                    }
                ]
            }
        },
        4: crypto.randomBytes(2).readUInt16BE(),
        5: crypto.randomBytes(4).readUInt32BE(),
        8: 1
    }
    body = core.pb.encode(body)
    await bot.sendUni("MessageSvc.PbSendMsg", body);
}

