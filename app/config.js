"use strict";
// # Alipay-Supervisor Configuration
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    version: "1.0",
    debug: true,
    // 接收通知服务器API地址
    // 示例 https://www.webapproach.net/site/apsvnotify
    pushStateAPI: "http://localhost:7001/api/spider",
    // 推送方的应用ID(本程序), 用于区分和辨别合法的发送方
    pushAppId: "",
    // 推送方的应用密钥
    pushAppKey: "",
    // 服务器验证签名参数, 此密钥用于按既定签名算法生成签名
    pushStateSecret: "apspider2018",
    // 爬取订单任务间隔(秒)，不推荐过小的任务间隔
    interval: 3,
    // 开启异常邮件通知(cookies过期异常忽略该选项并始终都会通知)
    enableExNotify: false,
    // 异常通知邮箱地址(多个邮箱以逗号分隔)
    email: "xxxxxxx@qq.com",
    // SMTP配置 - Host
    smtpHost: "smtp.qq.com",
    // SMTP配置 - Port
    smtpPort: 465,
    // SMTP配置 - username
    smtpUsername: "xxxxxxxxxxx@qq.com",
    // SMTP配置 - password
    smtpPassword: "xxxxxxxxxxxxx",
    iframe:'',
    newrank:{
        AppKey:'joker',
        Cookies:'',
        searchCookies:'',
        interval:500
    }
};