// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18

Date.prototype.Format = function (fmt) { // author: meizz
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
// nowDate 例 2020-11-30
const nowDate = new Date().Format("yyyy-MM-dd");


const axios = require('axios');

let result;
axios({
    method: 'post',
    url: 'https://bpa.lypt.edu.cn/xgh5/openData',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: {
        command: "XGXT",
        param: {
            "cmd": "yqsbFormSave",
            "xh": "20172310625",
            "sbsj": nowDate,
            "nl": "18",
            "lxfs": "15847195490",
            "jzdq": "0379",
            "jzdq_xxdz": "家",
            "tw": "36.5",
            "sflx": "0",
            "jcbr": "0",
            "zyzz": "1,",
            "fbrq": "",
            "zyzzms": "",
            "bz": "",
            "bz1": "",
            "wcjtgj": "",
            "wcjtgjxq": "",
            "wcdq": "",
            "wcdqxxdz": "",
            "lkdate": "",
            "fhdate": "",
            "zszt": "",
            "ylzd1": "",
            "qrblxqdz": "",
            "qrbltjdz": "",
            "jcdq": "",
            "jcxxdz": "",
            "jcsj": "",
            "qzsj": "",
            "zlyy": "",
            "zysj": "",
            "token": "2za30YpAZNtiONIfQ+TyJA"
        }

    }
}).then(value => {
    result = value.data
    console.log(value.data)
    pushInfo();
}).catch(reason => {
    result = reason
    console.log(reason)
    pushInfo();

})

function pushInfo() {
    axios({
        method: 'post',
        url: 'https://sc.ftqq.com/SCU51861T9b1350506cfcf9586f40e00252b66ceb5ce174da23773.send',
        params: {
            text: '打卡信息',
            desp: result
        }
    }).then(value => {
        console.log('推送成功')
    }).catch(reason => {
        console.log('推送失败')
    })

}
