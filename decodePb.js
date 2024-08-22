const zlib = require("zlib");
const protobuf = require("protobufjs");
var JSON = require("json-bigint")({ useNativeBigInt: true });
//传入buffer解析后返回json
//一般来说都是hex,所以你需要以下操作,处理一下数据
/*
//删除str所有空格
str = str.replace(/\s+/g, "");
//如果str前2字节为00 00，则删除前4字节
if (str.substring(0, 4) == "0000") {
  str = str.substring(8);
}
let json = decodePb(Buffer.from(str, 'hex'));

//var JSON = require("json-bigint")({ useNativeBigInt: true });
//使用json-bigint来替代JavaScript原生的解决bigint的问题

//const protobuf = require("protobufjs");
//请不要使用icqq或者oicq内的旧版本protobufjs。。。。

//const zlib = require("zlib");
//来解压QQ的GZIP数据，GZIP有多种类型自行完善所有的

//别问，问就是不会写瞎写的能跑，有BUG


*/
function long2int(long) {
    if (long.high === void 0)
        return Number(long)
    if (long.high === 0)
        return long.low >>> 0;
    const bigint = (BigInt(long.high) << 32n) | (BigInt(long.low) & 0xffffffffn);
    const int = Number(bigint);
    return Number.isSafeInteger(int) ? int : bigint;
}
function isReadable(hexString) {
    try {
        decodeURIComponent(hexString);
        return true;
    } catch (e) {
        return false;
    }
}
function isToStr(buf) {
    const bufHex = buf.toString('hex');
    if (bufHex.includes("0000")) {
        return { "type": "hex", "data": buf.toString("hex").toUpperCase() }
    } else if (isReadable(bufHex.replace(/(..)/g, '%$1').toUpperCase())) {
        return buf.toString()
    } else if (
        (bufHex.startsWith("5b") || bufHex.startsWith("7b"))
        &&
        (bufHex.endsWith("5d") || bufHex.endsWith("7d"))) {
        return buf.toString()
    } else {
        return { "type": "hex", "data": buf.toString("hex").toUpperCase() }
    }
}
function decodePb(buf) {
    const result = {}
    const reader = new protobuf.Reader(buf);
    while (reader.pos < reader.len) {
        const k = reader.uint32();
        const tag = k >> 3, type = k & 0b111;
        let value, decoded, temp;
        if (tag > 25600) return isToStr(buf);
        // console.log(tag,k,type,buf,"\n",buf.toString(),"\n");
        switch (type) {
            case 0:
                temp = reader.int64();
                value = long2int(temp);
                break;
            case 1:
                temp = reader.double()
                if (isNaN(temp) || temp.toString().includes("e")) {
                    reader.pos = reader.pos - 8;
                    value = long2int(reader.fixed64());
                } else {
                    value = temp;
                }
                break;
            case 2:
                value = Buffer.from(reader.bytes());
                if (value[0] == 0x01 || value[0] == 0x00) {
                    const Prefix = value.toString("hex").slice(0, 2);
                    let data = value.subarray(1);
                    let data_json = {};
                    data_json.Prefix = Prefix;
                    if (data[0] == 0x78 && data[1] == 0x9c) {
                        Deflatedata = zlib.unzipSync(data);
                        data_json.txt = Deflatedata.toString();
                        data_json.tip =
                            "数据被加密过,使用时请把数据加密回去 deflateSync()";
                        value = data_json;
                        break;
                    }
                }
                try {
                    decoded = decodePb(value);
                } catch (error) {
                    decoded = isToStr(value);
                }
                value = decoded;
                break;
            case 3:

            case 5:
                temp = reader.float();
                if (isNaN(temp) || temp.toString().includes("e")) {
                    reader.pos = reader.pos - 4;
                    value = reader.fixed32();
                } else {
                    value = Number(temp.toFixed(13));
                }
                break;
            default:
                if (value === void 0) {
                    return isToStr(buf);
                } else {
                    return isToStr(value);
                }
        }
        if (Array.isArray(result[tag])) {
            result[tag].push(value);
        } else if (Reflect.has(result, tag)) {
            result[tag] = [result[tag]];
            result[tag].push(value);
        } else {
            result[tag] = value;
        }
    }
    return result;
}
