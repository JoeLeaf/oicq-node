async function sendShake2(source_group_id) {
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
                        "17": {
                            "1": 0
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
    }
    body = core.pb.encode(body)
    await bot.sendUni("MessageSvc.PbSendMsg", body);
}
