/*
众所周知红包这玩意很危险,没人碰
而oicq更离谱,没有办法判断是不是红包

而我想把群里发语音红包和文字红包带节奏的沙雕给处理了,就显得很无力,特此写了一份这个玩意

sb给爷死!

*/


client.on("internal.sso", function (cmd, payload, seq) {
    try {
        if (cmd == "OnlinePush.PbPushGroupMsg") {
            let proto = core.pb.decode(payload)
            let GroupMsg = {};

            if (proto[1][3][1][2][0][8]) {
                //console.log("图片消息");
            } else {
                GroupMsg.typeface = proto[1][3][1][1][9].toString();
                //proto[1][3][1][2][0][2]   1为文本消息 2为表情消息
                if (proto[1][3][1][2][0][1]) {
                    GroupMsg.msg = proto['1']['3']['1']['2'][0]['1']['1'].toString()
                    if (GroupMsg.typeface == "Times New Roman" && GroupMsg.msg.indexOf("[QQ红包]") != -1) {
                        GroupMsg.SenderQQ = proto['1']['1']['1']
                        GroupMsg.SenderName = proto['1']['1']['9']['4'].toString()
                        GroupMsg.GroupNumber = proto['1']['1']['9']['1']
                        GroupMsg.GroupName = proto['1']['1']['9']['8'].toString()
                        GroupMsg.HB_red_ID = proto['1']['3']['1']['2'][1]['24']['1']['3']['14'].toString()
                        GroupMsg.HB_Title = proto['1']['3']['1']['2'][1]['24']['1']['3']['3'].toString()
                        GroupMsg.HB_Type = proto['1']['3']['1']['2'][1]['24']['1']['8']
                        GroupMsg.HB_Style = proto['1']['3']['1']['2'][1]['24']['1']['12']
                        GroupMsg.HB_ID = proto['1']['3']['1']['2'][1]['24']['1']['9'].toString()
                        GroupMsg.HB_authkey = proto['1']['3']['1']['2'][1]['24']['1']['10'].toString()
                        GroupMsg.HB_channel = proto['1']['3']['1']['2'][1]['24']['1']['19']
                        switch (GroupMsg.HB_Type) {
                            case 2:
                                GroupMsg.HB_TypeTitle = "";
                                switch (GroupMsg.HB_Style) {
                                    case 6:
                                        GroupMsg.HB_TypeTitle += '[拼手气]';
                                        break;
                                    case 12:
                                        GroupMsg.HB_TypeTitle += '[文字口令]';
                                        break;
                                    case 16:
                                        GroupMsg.HB_TypeTitle += '[专属]';
                                        GroupMsg.HB_ToUin = String(proto[1][3][1][2][1][24][1][20]);
                                        break;
                                    case 26:
                                        GroupMsg.HB_TypeTitle += '[语音口令]';
                                        break;
                                    case 40:
                                        GroupMsg.HB_TypeTitle += '[一笔画]';
                                        break;
                                    default:
                                        GroupMsg.HB_TypeTitle += '[未知：' + GroupMsg.HB_Style + ']';
                                }
                                break;
                            case 4:
                                GroupMsg.HB_TypeTitle = '[普通红包]';
                                switch (GroupMsg.HB_Style) {
                                    case 4:
                                        break
                                    default:
                                        GroupMsg.HB_TypeTitle += '[未知：' + GroupMsg.HB_Style + ']';
                                }
                                break;
                            default:
                                GroupMsg.HB_TypeTitle = '未知红包：' + GroupMsg.HB_Type + '[未知：' + GroupMsg.HB_Style + ']';
                        }
                        GroupMsg.HB_RawData = proto['1']['3']['1']['2'][1]['24'].encoded.toString("hex").toUpperCase()
                        let qun = client.pickGroup(GroupMsg.GroupNumber)
                        //把红包消息信息发出来,如果不是我自己就不理会
                        if (GroupMsg.SenderQQ == 1341806518) {
                            let as = []
                            as.push({ user_id: GroupMsg.SenderQQ, nickname: "小叶子", message: JSON.stringify(GroupMsg, null, "\t") })
                            qun.makeForwardMsg(as).then((forwardMsg) => {
                                let message = [
                                    segment.xml(forwardMsg.data)
                                ]
                                qun.sendMsg(message);
                            })
                        }
                    }
                }
            }
            //这里储存每一条新的消息用来处理oicq不支持的消息
            decodePb(payload).then((json) => {
                fs.writeFile("test.txt", JSON.stringify(json) + payload.toString("hex").toUpperCase(), (err, data) => { if (err) throw err; });
            });
        }
    } catch (err) {
        console.log(err)
    }
})
