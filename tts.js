const fetch = require('node-fetch');
const protobuf = require('protobufjs');

let xyz_protobuf_json = { "nested": { "TtsVoiceItem": { "fields": { "voice": { "type": "bytes", "id": 1 }, "seq": { "type": "uint32", "id": 2 } } }, "TtsRspBody": { "fields": { "retCode": { "type": "uint32", "id": 1 }, "sessionId": { "type": "string", "id": 2 }, "outSeq": { "type": "uint32", "id": 3 }, "voiceData": { "rule": "repeated", "type": "TtsVoiceItem", "id": 4 }, "isLast": { "type": "bool", "id": 5 }, "pcmSampleRate": { "type": "uint32", "id": 6 }, "opusSampleRate": { "type": "uint32", "id": 7 }, "opusChannels": { "type": "uint32", "id": 8 }, "opusBitRate": { "type": "uint32", "id": 9 }, "opusFrameSize": { "type": "uint32", "id": 10 } } } } }

const root = protobuf.Root.fromJSON(xyz_protobuf_json);
const TtsVoiceItem = root.lookupType('TtsVoiceItem');
const TtsRspBody = root.lookupType('TtsRspBody');

async function textToSpeech(cookies, text, QQ) {
	const url = 'https://textts.qq.com/cgi-bin/tts';
	const params = {
		appid: '201908021016',
		sendUin: parseInt(QQ),
		text: text,
	};
	const response = await fetch(url, {
		method: 'POST',
		body: JSON.stringify(params),
		headers: { 'Content-Type': 'application/json', 'Cookie': cookies }
	});
	const buffer = await response.buffer();

	const ttsReader = buffer;
	let ttsWriter = Buffer.alloc(0);
	for (let i = 0; i < ttsReader.length;) {
		let dataLen = [];
		for (let j = i; j < ttsReader.length; j++) {
			if (ttsReader[j] == 0x0d) {
				i = j + 2;
				break;
			}
			dataLen.push(ttsReader[j]);
		}
		let length = parseInt('0x' + Buffer.from(dataLen).toString());
		if (length == 0) {
			break;
		}
		let ttsRsp = TtsRspBody.decode(ttsReader.slice(i, i + length));
		if (ttsRsp.retCode != 0) {
			console.log('can\'t convert text to voice');
			return;
		}
		for (let voiceItem of ttsRsp.voiceData) {
			ttsWriter = Buffer.concat([ttsWriter, voiceItem.voice]);
		}
		i += length + 2;
	}
	let ret = ttsWriter;
	ret[0] = 0x02;
	//console.log("小叶子,输出HEX查看数据结构:",ret.toString('hex'));
	return ret;
}


let cookies = "uin=1341806518; skey=;"
textToSpeech(cookies, '你好小叶子吱吱吱吱', '1341806518')


//参照https://github.com/58565856/MiraiGo/blob/1b7e3d85807b9c9af42cb2825279eba61dbcd3bf/client/http_api.go

/*

package richmedia

type TtsRspBody struct {
	RetCode        uint32          `protobuf:"varint,1,opt"`
	SessionId      string          `protobuf:"bytes,2,opt"`
	OutSeq         uint32          `protobuf:"varint,3,opt"`
	VoiceData      []*TtsVoiceItem `protobuf:"bytes,4,rep"`
	Islast         bool            `protobuf:"varint,5,opt"`
	PcmSampleRate  uint32          `protobuf:"varint,6,opt"`
	OpusSampleRate uint32          `protobuf:"varint,7,opt"`
	OpusChannels   uint32          `protobuf:"varint,8,opt"`
	OpusBitRate    uint32          `protobuf:"varint,9,opt"`
	OpusFrameSize  uint32          `protobuf:"varint,10,opt"`
}

type TtsVoiceItem struct {
	Voice []byte `protobuf:"bytes,1,opt"`
	Seq   uint32 `protobuf:"varint,2,opt"`
}
*/


/*
func (c *QQClient) GetTts(text string) ([]byte, error) {
	apiUrl := "https://textts.qq.com/cgi-bin/tts"
	data := fmt.Sprintf(`{"appid": "201908021016","sendUin": %v,"text": %q}`, c.Uin, text)
	rsp, err := utils.HttpPostBytesWithCookie(apiUrl, []byte(data), c.getCookies())
	if err != nil {
		return nil, errors.Wrap(err, "failed to post to tts server")
	}
	ttsReader := binary.NewReader(rsp)
	ttsWriter := binary.SelectWriter()
	for {
		// 数据格式 69e(字符串)  十六进制   数据长度  0 为结尾
		// 0D 0A (分隔符) payload  0D 0A
		var dataLen []byte
		for b := ttsReader.ReadByte(); b != byte(0x0d); b = ttsReader.ReadByte() {
			dataLen = append(dataLen, b)
		}
		ttsReader.ReadByte()
		var length int
		_, _ = fmt.Sscan("0x"+string(dataLen), &length)
		if length == 0 {
			break
		}
		ttsRsp := &richmedia.TtsRspBody{}
		err := proto.Unmarshal(ttsReader.ReadBytes(length), ttsRsp)
		if err != nil {
			return nil, errors.Wrap(err, "failed to unmarshal protobuf message")
		}
		if ttsRsp.RetCode != 0 {
			return nil, errors.New("can't convert text to voice")
		}
		for _, voiceItem := range ttsRsp.VoiceData {
			ttsWriter.Write(voiceItem.Voice)
		}
		ttsReader.ReadBytes(2)
	}
	ret := ttsWriter.Bytes()
	ret[0] = '\x02'
	return ret, nil
}
*/
