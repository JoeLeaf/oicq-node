async function checkIn() {
  const p_skey = (await get_pskey('ti.qq.com'))['ti.qq.com'];
  const headers = {
    "Content-Type": "application/json",
    Cookie: `uin=${client.uin};p_skey=${p_skey};`,
  };
  const body = {
    uin: client.uin,
    type: "1",
    qua: "V1_AND_SQ_9.0.20_5844_YYB_D",
    mpExtend: {
      tianshuAdsReq: '{"app":"QQ","os":"Android","version":"9.0.20","imei":""}',
    },
  };
  await fetch("https://ti.qq.com/hybrid-h5/api/json/daily_attendance/SignIn", {
    headers: headers,
    body: JSON.stringify(body),
    method: "POST",
  });
}
