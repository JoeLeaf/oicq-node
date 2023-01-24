const { core } = require("oicq")
const crypto = require('crypto');

//type 1为私聊 0为群聊
//看到xyz或者小叶子 表示都可以传值,但是我没有数据,就直接固定,影响不大

async function sendShake3(recipient, id, num, type = 0) {
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
	type ? body[1][1] = { "1": recipient } : body[1][2] = { "1": recipient }
	body = core.pb.encode(body)
	await bot.sendUni("MessageSvc.PbSendMsg", body);
}
