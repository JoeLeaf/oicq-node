const cron = require('node-cron');
const fetch_a = require("node-fetch");
//由于我node18版本自带fetch,而我用的是旧版2.xx所以这里用fetch_a来声明

cron.schedule('0 0 * * 5', async () => {
    try {
        // 每周五00:00执行
        let qun = client.pickGroup(148651459);
        //这里是定时提醒的群
        let url = 'https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions?locale=zh-CN&country=CN&allowCountries=CN'
        let res = await fetch_a(url).catch((err) => console.error(err))
        if (!res) { console.error('[epic] 接口请求失败'); return data.reply('epic接口请求失败') }
        res = await res.json()
        let epic_list = res.data.Catalog.searchStore.elements
        let epic_num = res.data.Catalog.searchStore.elements.length
        for (let i = 0; i < epic_num; i++) {
            const element = epic_list[i];
            const before_discount = element.price.totalPrice.originalPrice
            const after_discount = element.price.totalPrice.discountPrice
            if (after_discount == 0 && before_discount > after_discount) {
                let msg_text = "" + element.title
                    + "\n" + element.description
                    + "\n上架时间:" + timeTrans(element.effectiveDate, 0)
                    + "\n原价:" + element.price.totalPrice.fmtPrice.originalPrice
                    + "\n现价:¥0"
                    + "\n结束时间:" + timeTrans(element.price.lineOffers[0].appliedRules[0].endDate, 0)
                const message = [msg_text,
                    segment.image(element.keyImages[0].url),
                    "\n地址:https://www.epicgames.com/store/zh-CN/p/" + element.catalogNs.mappings[0].pageSlug,
                ]
                await data.sendMsg(message)
            }
        }
    } catch {
        console.log("xyz:定时任务有问题哦~");
    }
});
function timeTrans(time, type) {
    let date = new Date(new Date(time).getTime() + 8 * 3600 * 1000)
    date = date.toJSON();
    if (type === 1) {
        date = date.substring(0, 10)
    }
    else {
        date = date.substring(0, 19).replace('T', ' ')
    }
    return date
}
