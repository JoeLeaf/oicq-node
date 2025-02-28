//使用tcp获取加速任务信息
async function getTask() {
  const body = {
    "2": 0，
    "3": "{\"from\":2,\"platform\":1}"
  }
  const res = await bot。sendUni("MQUpdateSvc_com_qq_ti.web.OidbSvcTrpcJsapiTcp.0x9172_0"， core。pb。encode(body));
  const taskList = pb。decode(res)["4"]。toString();
  return JSON。parse(taskList);
}
