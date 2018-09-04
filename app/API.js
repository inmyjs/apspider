/**
 * ajax
 * @type {{init: Request.init, get: Request.get, post: Request.post}}
 */
var app_config = require("./app/config");
var Request={
    init:function (type,url,data,callback) {
        $.ajax({
            url,
            type,
            data,
            dataType : 'json',
            headers: {
                'Cookie' : app_config.default.newrank.Cookies,
            },
            success : callback,
            error : function(xhr, error, exception) {
                // handle the error.
                Spider.logout(exception.toString(),'error');
            }
        });
    },
    get:function (url,data,callback) {
        this.init('GET',url,data,callback);
    },
    post:function (url,data,callback) {
        this.init('POST',url,data,callback);
    }
};

var h = function () {
    for (var a = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"], b = 0; b < 500; b++) for (var c = "", d = 0; d < 9; d++) {
        var e = Math.floor(16 * Math.random());
        c += a[e]
    }
    return c
};
function getToken(a,e) {
    var AppKey= app_config.default.newrank.AppKey;
    var f = [];
    $.each(e, function (a, c) {
        f.push($.trim(a))
    });
    f.sort();
    var g = {}, i = "";
    0 == a.indexOf("http://") ? i += a.slice(a.indexOf("/", 7)) + "?AppKey=" + AppKey : 0 == a.indexOf("https://") ? i += a.slice(a.indexOf("/", 8)) + "?AppKey=" + AppKey : i = a + "?AppKey=" + AppKey, $(f).each(function () {
        var a = this;
        g[a] = e[a], i += "&" + a + "=" + e[a]
    });
    var j = h();
    i += "&nonce=" + j;
    return {nonce:j,xyz : md5(i)};
    //return {nonce:'981b24ec1',xyz :'ae43708a42cf74f54e980271687a1ba3'};
}

/**
 * 新榜
 * @type
 */
var newrank = {
    login:'https://www.newrank.cn/public/login/login.html?back=https%3A//www.newrank.cn/',
    weixin: {
        html:'https://www.newrank.cn/public/info/list.html?period=day&type=data',
        date_url:'https://www.newrank.cn/xdnphb/list/getDate',
        date:function (callback) {
            var param={};
            var token=getToken(this.date_url,param);
            Object.assign(param, token);
            Request.post(this.date_url,param,callback);
        },
        list_url: 'https://www.newrank.cn/xdnphb/list/day/rank',
        list:function (rank_name_group,rank_name,date,callback) {
            var param= {
                rank_name_group,
                rank_name,
                start: date,
                end: date
            };
            var token=getToken(this.list_url,param);
            Object.assign(param, token);
            Request.post(this.list_url,param,callback);
        },
        list_param:{
            rank_name_group:'',
            rank_name:'',
            start: '',
            end:''
        },
        detail_url: 'https://www.newrank.cn/xdnphb/detail/getAccountArticle',
        detail:function (uuid,callback) {
            var param=this.detail_param;
            param.uuid=uuid;
            var token=getToken(this.detail_url,param);
            Object.assign(param, token);
            Request.post(this.detail_url,param,callback);
        },
        detail_param:{
            flag:true,
            uuid:''
        },
        dataSearch_html:'https://data.newrank.cn/articleResult.html',
        dataSearch_url: 'https://data.newrank.cn/xdnphb/data/article/search',
        dataSearch:function (param,callback) {
            var _param=this.dataSearch_param;
            Object.assign(_param, param);
            var token=getToken(this.dataSearch_url,_param);
            Object.assign(_param, token);
            Request.post(this.dataSearch_url,_param,callback);
        },
        dataSearch_param: {
            category: '',
            containAdd: '',
            containOr: '',
            eliminate: '',
            endDate: '',
            keywords: '',
            orderBy: 2,
            original: 0,
            pageNumber: 1,
            rankName: '',
            searchType: 0,
            startDate: '',
            video: 0,
            week: 3
        }
    }
};