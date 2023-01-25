const { core } = require("oicq")
const crypto = require('crypto');

//type 1为私聊 0为群聊
//size是大小最大是3

//啊发现oicq有可以这样发[{"type":"shake","id":1,"text":"戳一戳"}]
//嗯新的发现,大于1999也就是2000就变成超级会员表情了,然后结构发生了变化,oicq发不出来
//下面免会员可发会员戳戳
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
								"1": 1,
								"3": 0,
								"4": 1,
								"5": "",
								"6": "7.2.0",
								"7": parseInt(size),
								"10": 0
							},
							"3": 1
						}
					},
					{
						"1": {
							"1": "[刷RNB系统]请使用最新版手机QQ体验新功能。"
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
	};
	if (id > 1999) {
		body[3][1][2][0][53][2][1] = 126
		body[3][1][2][0][53][2][4] = id
		body[3][1][2][0][53][3] = 126
	} else {
		body[3][1][2][0][53][2][1] = id
		body[3][1][2][0][53][2][4] = 1
		body[3][1][2][0][53][3] = id
	}
	type ? body[1][1] = { "1": recipient } : body[1][2] = { "1": recipient }
	body = core.pb.encode(body)
	await bot.sendUni("MessageSvc.PbSendMsg", body);
}



