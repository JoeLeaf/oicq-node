const WebSocket = require('ws');
//接口来源:https://huggingface.co/spaces/zomehwh/vits-uma-genshin-honkai
async function wss_speech(text, language = "中文", role = "钟离", feeling = 0.6, uttLen = 0.668, speed = 1.2) {
    const ws = new WebSocket('wss://zomehwh-vits-uma-genshin-honkai.hf.space/queue/join');
    let voice = await new Promise((resolve, reject) => {
        let session_hash = Math.random().toString(36).substring(2)
        ws.on('open', function open() {
            ws.send(JSON.stringify({ "session_hash": session_hash, "fn_index": 0 }));
        });
        ws.on('message', function incoming(data) {
            data = JSON.parse(data);
            if (data.msg == "send_data") {
                ws.send(JSON.stringify({ "fn_index": 0, "data": [text, language, role, feeling, uttLen, speed], "session_hash": session_hash }));
            } else if (data.msg == "process_completed") {
                let base64 = data.output.data[1]
                base64 = base64.replace("data:audio/wav;base64,", "")
                resolve(base64)
                ws.close();
            }
        });
    });
    return voice;
}
