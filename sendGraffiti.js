const crypto = require('crypto');
const { core } = require("oicq")
//第32行可以设置涂鸦模型
//手机QQ上涂鸦背景从左往右数，从0开始
//手画数据是[涂鸦hash]和[涂鸦图片地址]，背景是[模型Id]，可以自由组合数据和模型，比如你可以换掉别人涂鸦消息的模型(背景)

async function sendGraffiti(recipient,url,type=0) {
	const response = await fetch(url)
	const pic_buffer = await response.buffer()
	const pic_md5 = crypto.createHash('md5').update(pic_buffer).digest('hex').toUpperCase()
	let body = {
		"1": {
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
						"1": {
							"1": "[涂鸦]"
						}
					},
					{
						"53": {
							"1": 11,
							"2": {
								"5": 1458,
								"6": 0,
								"7": url,
								"8": pic_md5
							},
							"3": 1
						}
					},
					{
						"37": {
							"17": 10167,
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
	bot.sendUni("MessageSvc.PbSendMsg", body);
}
sendGraffiti(148651459,"http://p.qpic.cn/DynaDoodle/0/841b7ccd-db44-4b25-844c-829872130611/0")


//当你看到这条消息时表示,涂鸦和秀图一样,几千分之一才能发出来,被腾讯取消了
