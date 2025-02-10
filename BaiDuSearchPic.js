//搜图的多了Acs-Token头加密，后续的自己写
//BaiDuSearchPic 传入图片地址或者图片的blob
function aes_encrypt(data, key, iv) {
  const r = crypto.createCipheriv(
    "aes-128-cbc",
    Buffer.from(key),
    Buffer.from(iv)
  );
  let s = r.update(data, "utf-8", "base64");
  return (s += r.final("base64"));
}
async function BaiDuSearchPic(pic) {
  const formData = new FormData();
  formData.append("tn", "pc");
  formData.append("from", "pc");
  formData.append("range", '{"page_from": "searchIndex"}');
  const timer = new Date().getTime()
  const Acs_Token = timer - 74959818 + "_" + timer + aes_encrypt(btoa(`{"d0":"","ua":"","baiduid":"","platform":"Win32","d23":0,"d1":"","d2":0,"hf":"","hfe":"","h0":"","d78":41084,"d420":0,"clientTs":${timer - 54959818},"version":"1.4.0.3","extra":"","odkp":0}`), "awycaseiiageuigo", "1234567887654321")
  if (typeof pic === "string") {
    formData.append("image", pic);
    formData.append("image_source", "PC_UPLOAD_SEARCH_URL");
  } else {
    const blob = new Blob([pic], { type: "image/png" });
    formData.append("image", blob, "a.png");
    formData.append("image_source", "PC_UPLOAD_SEARCH_FILE");
  }
  const rsp = await fetch("https://graph.baidu.com/upload", {
    headers: {
      "Acs-Token": Acs_Token
    },
    mode: "cors",
    method: "POST",
    body: formData,
  });
  const json = await rsp.json();
  return json;
}
