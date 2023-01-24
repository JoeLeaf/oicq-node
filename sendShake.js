const { core } = require("oicq")
const crypto = require('crypto');

//type 1为私聊 0为群聊
//size是大小最大是3

async function sendShake(recipient, id, size = 3, type = 0) {
	let body = {
		"1": {},
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
							"1": 2,
							"2": {
								"1": id,
								"3": 0,
								"4": crypto.randomBytes(4).readUInt16BE(),
								"5": "",
								"6": "",
								"7": parseInt(size),
								"10": 0
							},
							"3": id
						}
					},
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
	type ? body[1][1] = { "1": recipient } : body[1][2] = { "1": recipient }
	body = core.pb.encode(body)
	await bot.sendUni("MessageSvc.PbSendMsg", body);
}

//啊发现oicq有可以这样发[{"type":"shake","id":1,"text":"戳一戳"}]

