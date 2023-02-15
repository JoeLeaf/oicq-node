const { core } = require("oicq")
const crypto = require('crypto');

//type 1为私聊 0为群聊
//看到xyz或者小叶子 表示都可以传值,但是我没有数据,就直接固定,影响不大
async function sendBigEmoticons(recipient, id, type = 0) {
	let body = {
		1: {},
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
					},
					{
						1: {
							1: "/小叶子",
							12: {
								1: "[小叶子]咳咳你需要升级一下QQ咯"
							}
						}
					},
					{
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
	type ? body[1][1] = { "1": recipient } : body[1][2] = { "1": recipient }
	body = core.pb.encode(body)
	await bot.sendUni("MessageSvc.PbSendMsg", body);
}
/*
如果去我lib文件夹复制文件替换你的
converter.js	elements.d.ts	converter.d.ts	elements.js	parser.js
文件可以使用
使用方法
const message = [
	segment.lottie(343,"/我方了")
]

[{"type":"lottie","id":343,"text":"/我方了"}]

*/
