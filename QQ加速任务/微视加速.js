//try { await weiShiAccelerate(await getWeiShiSession()) } catch { }

function getHeadersCK(res) {
  return res.headers
    .getSetCookie()
    .map((item) => {
      return item.split(";")[0];
    })
    .join("; ");
}
async function getWeiShiSession() {
  const clientkey = bot.sig.st_web.toString("hex");
  const res = await fetch(
    `https://ssl.ptlogin2.qq.com/jump?clientuin=${bot.uin}&keyindex=19&pt_aid=716027609&daid=383&u1=https%3A%2F%2Fgraph.qq.com%2Foauth2.0%2Flogin_jump&pt_3rd_aid=1101083114&ptopt=1&style=40&clientkey=` +
    clientkey
  );
  const check_sig_url = (await res.text())
    .split(",")[1]
    .replaceAll("'", "")
    .substring(1);
  const res2 = await fetch(check_sig_url, {
    headers: { cookie: getHeadersCK(res) + "; " },
    redirect: "manual",
  });
  const cookie = getHeadersCK(res2);
  return await authorizeWeiShi(cookie);
}
async function authorizeWeiShi(cookie) {
  const pskey = getCookieValue(cookie, "p_skey");
  const res = await fetch("https://graph.qq.com/oauth2.0/authorize", {
    headers: {
      cookie: cookie,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
    body:
      "response_type=code&client_id=1101083114&redirect_uri=https%3A%2F%2Fh5.weishi.qq.com%2Fweishi%2Faccount%2Flogin%3Fr_url%3Dhttp%253A%252F%252Fmedia.weishi.qq.com%252F%26loginfrom%3Dqc&scope=&state=state&switch=&from_ptlogin=1&src=1&update_auth=1&openapi=1010&g_tk=" +
      getG_TK(pskey) +
      "&auth_time=",
  });
  return getHeadersCK(res);
}
async function weiShiAccelerate(cookies) {
  let headers = {
    "Content-Type": "multipart/form-data",
    Cookie: cookies,
  };
  let response = await fetch(
    "https://api.weishi.qq.com/trpc.weishi.weishi_h5_proxy.weishi_h5_proxy/WelfareBlockObtain?_csrf=2130390040",
    {
      headers: headers,
      body: JSON.stringify({
        req_body: {
          blockID: "2",
          bizPayload: '{"taskId":2072}',
        },
      }),
      method: "POST",
    }
  );
  let res = await response.json();
  if (res.rsp_header.ret == 0 && res.rsp_body != null) {
    response = await fetch(
      "https://api.weishi.qq.com/trpc.weishi.weishi_h5_proxy.weishi_h5_proxy/GetWelfarePageContent?_csrf=2130390040",
      {
        headers: headers,
        body: JSON.stringify({
          req_body: {
            source: 0,
            is_half_page: false,
            active_id: "",
            channel: "",
            extField: {
              is_new_user: "0",
            },
          },
        }),
        method: "POST",
      }
    );
    res = await response.json();
    try {
      return res.rsp_body.blocks[0].sub_blocks[0].btnText;
    } catch (error) {
      return JSON.stringify(res.rsp_body.blocks);
    }
  } else {
    return res.rsp_header.errMsg;
  }
}
