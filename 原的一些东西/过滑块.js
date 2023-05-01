const puppeteer = require('puppeteer');
process.on('uncaughtException', err => {
});
function run(gt, challenge, time = 400,error_n=1) {
  return new Promise(async (resolve, reject) => {
    const url = "http://hygzs.xyz/mhy/?gt=" + gt + "&challenge=" + challenge;
    async function tryValidation(distance) {
      //page.mouse.click(btn_position.btn_left, btn_position.btn_top, { delay: 1000 })
      await page.mouse.move(btn_position.btn_left, btn_position.btn_top)
      await page.mouse.down(btn_position.btn_left, btn_position.btn_top)
      let alllength = distance + btn_position.btn_left;
      let off = 0;
      setTimeout(async () => {
        off = 1;
        await page.mouse.move(alllength, btn_position.btn_top, { steps: 10 })
        await page.mouse.up();
      }, time);
      while (off == 0) {
        let randomX = Math.floor(Math.random() * distance + 50) + 1;
        let randomY = Math.floor(Math.random() * distance + 50) + 1;
        await page.mouse.move(btn_position.btn_left + randomX, btn_position.btn_top + randomY)
      }
      await timeout(1000);
      const result = await page.evaluate(() => {
        return document.querySelector('.geetest_result_content') && document.querySelector('.geetest_result_content').innerHTML;
      });
      if (result.includes('速度超过')) {
        return { status: 1, msg: '验证成功:' + result }
      } else {
        return { status: 0, msg: result }
      }
    }
    async function calculateDistance() {
      const distance = await page.evaluate(() => {
        function compare(document) {
          const ctx1 = document.querySelector('.geetest_canvas_fullbg');
          const ctx2 = document.querySelector('.geetest_canvas_bg');
          const pixelDifference = 30;
          let res = [];
          for (let i = 57; i < 260; i++) {
            for (let j = 1; j < 160; j++) {
              const imgData1 = ctx1.getContext("2d").getImageData(1 * i, 1 * j, 1, 1)
              const imgData2 = ctx2.getContext("2d").getImageData(1 * i, 1 * j, 1, 1)
              const data1 = imgData1.data;
              const data2 = imgData2.data;
              const res1 = Math.abs(data1[0] - data2[0]);
              const res2 = Math.abs(data1[1] - data2[1]);
              const res3 = Math.abs(data1[2] - data2[2]);
              if (!(res1 < pixelDifference && res2 < pixelDifference && res3 < pixelDifference)) {
                if (!res.includes(i)) {
                  res.push(i);
                }
              }
            }
          }
          return { min: res[0] - 2, max: res[res.length - 1] - 54 }
        }
        return compare(document)
      })
      return distance;
    }
    async function getBtnPosition() {
      const btn_position = await page.evaluate(() => {
        const { clientWidth, clientHeight } = document.querySelector('.geetest_panel_ghost')
        return { btn_left: clientWidth / 2 - 104, btn_top: clientHeight / 2 + 59 }
      })
      return btn_position;
    }

    let timeout = function (delay) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            resolve(1)
          } catch (e) {
            reject(0)
          }
        }, delay);
      })
    }

    let error_num = 0
    let page = null
    let btn_position = null
    let browser = null
    let distance = null
    while (error_num < error_n) {
      btn_position = null
      browser = null
      distance = null
      browser = await puppeteer.launch({
        headless: "new",
        // headless: false,
      });
      page = await browser.newPage();
      page.on('dialog', async dialog => {
        const msg = dialog.message();
        console.log(msg);
        if (msg.indexOf("请保持网络畅通") > -1 || msg.indexOf("not proof") > -1) {
          await browser.close();
          error_num = error_n
          resolve({ status: 0, msg: msg })
        }
        await dialog.accept();
      });
      await page.goto(url, { 'waitUntil': 'networkidle0' });
      btn_position = await getBtnPosition();
      distance = distance || await calculateDistance();
      let result = await tryValidation(distance.min)
      if (result.status == 1) {
        await timeout(1000)
        await browser.close();
        error_num = error_n
        resolve({ status: 1, msg: result.msg })
        return
      } else {
        await browser.close();
        error_num++
      }
    }
    resolve({ status: 0, msg: "失败啦~" })
  })
}

/*
用我服务器做接口,其实可以直接提取但是懒得改了
run(gt, challenge, 延时间隔,失败次数)

验证成功:0.2 秒的速度超过 99% 的用户
{
  code: 200,
  msg: 'success',
  data: {
    geetest_gt: 'd019a22590a54475b8e30eeb2854aab9',
    source_challenge: 'e6e77ddbd9b1123c385fde805bc7f35c',     
    geetest_challenge: 'e6e77ddbd9b1123c385fde805bc7f35cg1',  
    geetest_validate: '2a63277d372a4f8b7f73f01d9eb90d91',     
    geetest_seccode: '2a63277d372a4f8b7f73f01d9eb90d91|jordan'
  }
}
*/

//下面是获取gt和challenge然后使用方法
fetch("https://bbs-api.mihoyo.com/misc/api/createVerification?is_high=false").then(async (res) => {
  let json = await res.json();
  const challenge = json.data.challenge;
  const gt = json.data.gt;
  run(gt, challenge, 10,1).then((res) => {
    if (res.status == 1) {
      console.log(res.msg);
      fetch("http://hygzs.xyz/mhy/data.php?type=get&source_challenge=" + challenge ).then(async (res) => {
        console.log(await res.json())
      }).catch((err) => {
        console.log(err)
      })
    } else{
      console.log(res.msg);
    }
  }).catch((err) => {
    console.log(err)
  })
}).catch((err) => {
  console.log(err)
})
