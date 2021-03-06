const axios = require('axios');

Date.prototype.Format = function (fmt) {
    // author: meizz
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        S: this.getMilliseconds(), // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
            );
    return fmt;
};

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18

// nowDate 例 2020-11-30
const nowDate = new Date().Format("yyyy-MM-dd");

//默认超时时间
axios.defaults.timeout = 10000;
//默认重试次数
axios.defaults.retry = 3;
//默认间隔时间
axios.defaults.retryDelay = 1000;
let result1;

async function AutoClock() {

    await axios({
        method: "post",
        url: "https://bpa.lypt.edu.cn/xgh5/openData",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.85 Safari/537.36",
        },
        params: {
            command: "XGXT",
            param: {
                cmd: "yqsbFormSave",
                xh: "20172310625",
                sbsj: nowDate,
                nl: "18",
                lxfs: "15847195490",
                jzdq: "0379",
                jzdq_xxdz: "家",
                tw: "36.5",
                sflx: "0",
                jcbr: "0",
                zyzz: "1,",
                fbrq: "",
                zyzzms: "",
                bz: "",
                bz1: "",
                wcjtgj: "",
                wcjtgjxq: "",
                wcdq: "",
                wcdqxxdz: "",
                lkdate: "",
                fhdate: "",
                zszt: "",
                ylzd1: "",
                qrblxqdz: "",
                qrbltjdz: "",
                jcdq: "",
                jcxxdz: "",
                jcsj: "",
                qzsj: "",
                zlyy: "",
                zysj: "",
                token: "2za30YpAZNtiONIfQ+TyJA",
            },
        },
    })
        .then((value) => {
            result1 = value.data;
        })
        .catch((e) => {
            result1 = e.data;
        });
    console.log(result1)
    // 使用双推送服务器,防止出现问题
    await axios({
        method: "post",
        url: "https://api.nextrt.com/api/push/send",
        data: {
            title: "打卡信息",
            content: `
                    data:${result1.data}
                    message:${result1.message}
                    result:${result1.result}
                    `,
            type: "Telegram",
            token: "582bb60c95544f75198b6de1fbe74258",
        },
    })
        .then((res) => {
            console.log(res.data);
        })
        .catch((e) => {
            console.log(e.data);
        });
    await axios({
        method: "post",
        url: "https://api.nextrt.com/api/push/send",
        data: {
            title: "打卡信息",
            content: `
                    data:${result1.data}
                    message:${result1.message}
                    result:${result1.result}
                    `,
            type: "Email",
            token: "582bb60c95544f75198b6de1fbe74258",
        },
    })
        .then((res) => {
            console.log(res.data);
        })
        .catch((e) => {
            console.log(e.data);
        });


    await axios.post('http://pushplus.hxtrip.com/send', {
        token: '27f2d3c74908482799d775655f3d19f3',
        title: '多彩洛职自动打卡',
        content: result1,
        template: 'json'

    })
}

exports.main_handler = async (event, context) => {
    console.log("Hello World")
    console.log(event)
    console.log(event["non-exist"])
    console.log(context)
    //context.callbackWaitsForEmptyEventLoop=false

    await AutoClock();
    return event
};