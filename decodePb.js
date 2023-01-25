
const { core } = require("oicq")
const { unzipSync, deflateSync } = require("zlib")
const zlib = require("zlib")
//传入buffer解析后返回json
//一般来说都是hex,所以你需要以下操作,处理一下数据

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
	//console.log("小叶子调试",pb.decode(proto[3][1][2][1][1][1]));
	let index = 0;
	async function decode(proto, json) {
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
							if (data.length > 3) {
								let Prefix = ""
								if (data[0] == 0x01 || data[0] == 0x00) {
									Prefix = data.toString("hex").slice(0, 2);
									data = data.slice(1);
								}
								let data_json = {}
								data_json.Prefix = Prefix
								if (data[0] == 0x78 && data[1] == 0x9c) {
									Deflatedata = zlib.unzipSync(data);
									// data_json.RawData = proto[key].encoded;
									// data_json.DecompressedData =Deflatedata;
									// data_json.CompressType = "Deflate"
									data_json.txt = Deflatedata.toString();
									data_json.tip = "数据被加密过,使用时请把数据加密回去 deflateSync()"
									json[key] = data_json
									decode(proto[key], json[key]);
									continue;
								} else {
									json[key] = proto[key].encoded.toString();
									decode(proto[key], json[key]);
									continue;
								}
							}
							json[key] = proto[key].encoded.toString();
							decode(proto[key], json[key]);
							continue;
						}
						json[key] = {};
						decode(proto[key], json[key]);
					} catch (error) {
						let data = proto[key].encoded
						if (data.length > 3) {
							let Prefix = ""
							if (data[0] == 0x01 || data[0] == 0x00) {
								Prefix = data.toString("hex").slice(0, 2);
								data = data.slice(1);
							}
							let data_json = {}
							data_json.Prefix = Prefix
							if (data[0] == 0x78 && data[1] == 0x9c) {
								Deflatedata = zlib.unzipSync(data);
								// data_json.RawData = proto[key].encoded;
								// data_json.DecompressedData =Deflatedata;
								// data_json.CompressType = "Deflate"
								data_json.txt = Deflatedata.toString();
								data_json.tip = "数据被加密过,使用时请把数据加密回去 deflateSync()"
								json[key] = data_json
								decode(proto[key], json[key]);
								continue;
							} else {
								json[key] = proto[key].encoded.toString();
								decode(proto[key], json[key]);
								continue;
							}
						}
						json[key] = proto[key].encoded.toString();
						decode(proto[key], json[key]);
						continue;
					}
				}
			} else {
				//console.log("小叶子调试",proto[key]);
				let value = proto[key];
				if (typeof value == "bigint") {
					value = value.toString();
					value = Number(value);
				}
				json[key] = value
			}
		}
	}
	decode(proto, json);
	return json;
}
