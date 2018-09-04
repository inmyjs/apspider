/**
 * 主入口
 */
let gui = require('nw.gui');
gui.App.clearCache();

// 获取window对象
var win = nw.Window.get();
win.maximize();
//win.showDevTools();

// Listen to main window's close event
win.on('close', function() {
    // Hide the window to give user the feeling of closing immediately
    this.close(true);
});


// # Alipay-Supervisor Startup
const forever=require("forever");
var schedule = require("node-schedule");
var moment = require("moment");
var app_config = require("./app/config");


var iframe ,iframeDOM,currentHtml,search_iframeDOM,search_iframe;

Spider.vue=new Vue({
    el:'#app',
    data:{
        login_text:'登录',
        start_text:'开始',
        start_loading:false,
        activeName:'first',
        spider_categorys:[],
        logs:[],
        searchs:[],
        containAdd:'',
        category:'',
        search_dates:'',
        pickerOptions: {
            shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近一个月',
                onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                }
            }, {
                text: '最近三个月',
                onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                }
            }]
        }
    },
    methods:{
        clear(){
          this.logs=[];
        },
        handleOpen(key, keyPath) {
        },
        handleClose(key, keyPath) {
        },
        handleClick(tab, event) {
        },
        login(){
            Spider.logout("打开登录扫码页面");
            currentHtml='login';
            iframe.attr('src',newrank.login);
            iframeDOM.onload = iframeLoad;
        },
        start(){
            if(currentHtml!='wx_list') {
                Spider.logout("打开排行榜页面");
                currentHtml = "wx_list";
                iframe.attr('src', newrank.weixin.html);
            }else{
                Spider.logout("开始读取公众号列表");
                $.publish('newrank_weixin_start');
                $('#end_btn').show();
            }
        },
        close(){
            Spider.logout("正在关闭...");
            $.publish('newrank_weixin_stop');
        },
        search(){
            if(currentHtml!='search_list') {
                Spider.logout("打开搜索页面...");
                currentHtml="search_list";
                iframe.attr('src', newrank.weixin.dataSearch_html);
            }else{
                searchData();
            }
        }
    }
});
function searchData() {
    Spider.logout("正在搜索...");
    var startDate='',endDate='',week=1;
    if(Spider.vue.search_dates.length>0) {
        week=3;
        startDate = moment(Spider.vue.search_dates[0]).format("YYYY-MM-DD");
        endDate = moment(Spider.vue.search_dates[1]).format("YYYY-MM-DD");
    }
    $.publish('newrank_weixin_search_start', {
        param: {
            startDate,
            endDate,
            week,
            //category: Spider.vue.category,
            containAdd: Spider.vue.containAdd,
        }
    });
}
/**
 * 输出日志
 * @param text
 */
Spider.logout=function(text,type) {
    if (!app_config.default.debug || !text) {
        return;
    }
    type=type?type:'info';
    Spider.vue.logs.push({title:`[${moment().format("YYYY-MM-DD HH:mm:ss")}]  ${text}`,type});
};

$(function () {
    iframe = $('#pay_iframe');
    app_config.default.iframe=iframe;
    iframeDOM = document.getElementById("pay_iframe");
    //iframe.show();

    search_iframe = $('#search_iframe');
    search_iframeDOM = document.getElementById("search_iframe");
});

/**
 * 页面加载完成事件
 */
function iframeLoad() {
    app_config.default.newrank.Cookies = iframeDOM.contentWindow.document.cookie;
    switch (currentHtml){
        case 'login':
            getCode();
            break;
        case 'logining':
            Spider.logout("登录成功");
            Spider.vue.login_text='重新登录';
            $('#login_code').hide();
            $('#start_btn').show();
            break;
        case 'wx_list':
            Spider.logout("开始读取公众号列表");
            Spider.vue.start_text='抓取中...';
            Spider.vue.start_loading=true;
            $.publish('newrank_weixin_start');
            $('#end_btn').show();
            break;
        case 'search_list':
            searchData();
            break;
    }
}

/**
 * 获取二维码
 */
function getCode() {
    var img=iframe.contents().find(".login-action-code").children('img');
    if(img.length>0){
        $('#login_code').show();
        $('#login_code').attr('src',img.attr("src"));
        if(img.attr('src').indexOf("mp.weixin.qq.com")>1){
            Spider.logout("请扫码二维码");
            currentHtml='logining';
            return;
        }
    }
    setTimeout(getCode, 1000);
}