const { core } = require("oicq")
//传入buffer解析后返回json
//一般来说都是hex,所以你需要一下操作,处理一下数据

/*
//删除str所有空格
str = str.replace(/\s+/g, "");
//如果str前2字节为00 00，则删除前4字节
if (str.substring(0, 4) == "0000") {
  str = str.substring(8);
}

let json = await decodePb(Buffer.from(str, 'hex'));

*/

async function decodePb(buffer_data) {
    let pb = core.pb;
    let proto = pb.decode(buffer_data);
    let json = {}
    delete proto.encoded;
    //console.log("xyz调试",pb.decode(proto[3][1][2][1][1][1]));
    let index = 0;
    function decode(proto, json) {
        for (let key in proto) {
            if (key == "encoded") {
                continue;
            }
            if (proto[key] instanceof Object) {
                if (proto[key] instanceof Array) {
                    json[key] = [];
                    for (let i = 0; i < proto[key].length; i++) {
                        json[key].push({});
                        decode(proto[key][i], json[key][i]);
                    }
                } else {
                    try {
                        if (pb.decode(proto[key].encoded) == null) {
                            json[key] = proto[key].encoded.toString();
                            decode(proto[key], json[key]);
                            continue;
                        }
                        json[key] = {};
                        decode(proto[key], json[key]);
                    } catch (error) {
                        json[key] = proto[key].encoded.toString();
                        decode(proto[key], json[key]);
                    }
                }
            } else {
                json[key] = proto[key];
            }
        }
    }
    decode(proto, json);
    return json;
}
