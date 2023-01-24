const { core } = require("oicq")
const { unzipSync, deflateSync } = require("zlib")
const crypto = require('crypto');


//type 1为私聊 0为群聊
async function sendFlashingwords(recipient, id, text, type = 0) {
	//{"1":2,"2":{"1":109,"2":"8.9.28.10155","3":"29","4":0,"5":"FlashChatManager","6":20,"9":1,"10":"8.9.28.10155","11":"FlashChatManager"},"4":{"1":1,"2":1,"3":1,"4":{"1":1002,"2":"flashchat.2003.7_7_5.android.zip","3":{}}}}
	//{"2":"操作成功","3":2,"4":{"1":1800,"2":20},"6":{"2":{"1":1002,"2":"flashchat.2003.7_7_5.android.zip","3":"4daf71d265880da10e514b9a81bf1e72","6":1,"7":1,"8":"https://iv6.gtimg.cn/club/item/parcel/scupdate/1002/flashchat.2003.7_7_5.android.zip/5a8dc7ddb7574d2bb4e86ff8a6213c35.zip.zip","9":8615,"12":{},"14":1}}}
	//scupdate.handle
    //可以开拓玩法,里面包含了其他模板框架
	let BUF1 = Buffer.from([1])
	let view_json = {
		"2000": {
			"appMinVersion": "1.0.0.16",
			"appName": "com.tencent.randomwords",
			"appView": "main",
			"appDesc": "随机字"
		},
		"2001": {
			"appMinVersion": "1.0.0.15",
			"appName": "com.tencent.vibrate",
			"appView": "main",
			"appDesc": "颤动"
		},
		"2002": {
			"appMinVersion": "1.0.0.12",
			"appName": "com.tencent.flash",
			"appView": "main",
			"appDesc": "爆闪"
		},
		"2003": {
			"appMinVersion": "1.0.0.12",
			"appName": "com.tencent.hacker",
			"appView": "main",
			"appDesc": "黑客帝国"
		},
		"2004": {
			"appMinVersion": "1.0.0.12",
			"appName": "com.tencent.scale",
			"appView": "main",
			"appDesc": "快闪"
		}
	}
	if (view_json[id]) {
		let json = { "a": "com.tencent.scale", "desc": "快闪", "resid": 2004, "m": "main", "v": "1.0.0.12", "prompt": "小叶子" }
		json.a = view_json[id].appName
		json.desc = view_json[id].appDesc
		json.resid = id
		json.m = view_json[id].appView
		json.v = view_json[id].appMinVersion
		json.prompt = text
		let deflate = deflateSync(JSON.stringify(json))
		deflate = Buffer.concat([BUF1, deflate])
		let body = {
			"1": {
			},
			"2": {
				"1": 1,
				"2": 0,
				"3": 0
			},
			"3": {
				"1": {
					"2": [
						{
							"1": {
								"1": text
							}
						},
						{
							"53": {
								"1": 14,
								"2": {
									"1": id,
									"2": deflate
								},
								"3": 0
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
			"5": crypto.randomBytes(4).readUInt32BE(),
			"8": 0
		}
		type ? body[1][1] = { "1": recipient } : body[1][2] = { "1": recipient }
		body = core.pb.encode(body)
		await bot.sendUni("MessageSvc.PbSendMsg", body);
	} else {
		let body = {
			"1": {},
			"2": {
				"1": 1,
				"2": 0,
				"3": 0
			},
			"3": {
				"1": {
					"2": [
						{
							"1": {
								"1": "ID错误"
							}
						},
						{
							"37": {
								"1": 165,
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
			"5": crypto.randomBytes(4).readUInt32BE(),
			"8": 1
		}
		type ? body[1][1] = { "1": recipient } : body[1][2] = { "1": recipient }
		body = core.pb.encode(body)
		await bot.sendUni("MessageSvc.PbSendMsg", body);
	}
}
