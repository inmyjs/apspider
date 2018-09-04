/**
 * 订阅发布任务
 */

var app_config = require("./app/config");
(function($) {
    var o = $({});//自定义事件对象
    $.each({
        trigger: 'publish',
        on: 'subscribe',
        off: 'unsubscribe'
    }, function(key, val) {
        jQuery[val] = function() {
            o[key].apply(o, arguments);
        };
    });
})(jQuery);

var group_list=[],public_list=[],query_date;
/**
 * 停止读取
 */
$.subscribe('newrank_weixin_stop', function(e, msg) {
    group_list=[];
    public_list=[];
});
/**
 * 订阅资讯分类，读取资讯所有分类，发布分类下公众号获取任务
 */
$.subscribe('newrank_weixin_start', function(e, msg) {
    newrank.weixin.date(function (res) {
        query_date = res.value.IMAGE_UPLOAD_DAY.substr(0, 10);
        var zixun = Spider.vue.spider_categorys;
        if (zixun.length > 0) {
            group_list=zixun;
            $.publish('newrank_weixin_list_start', {
                index: 0
            });
        }else
            Spider.logout("读取所有分类失败",'error');
    });
});

/**
 * 订阅获取公众号列表：给定分类列表，每次一个分类
 */
$.subscribe('newrank_weixin_list_start', function(e, msg) {
    var len=group_list.length;
    if(msg.index<len) {
        var arr=group_list[msg.index].split("|");
        var rank_name_group=arr[0],rank_name=arr[1];
        newrank.weixin.list(rank_name_group, rank_name,query_date, function (res) {
            var datas = res.value.datas;
            if (datas) {
                //发送服务器
                Ap.request.post(app_config.default.pushStateAPI+"/weixin/public",{rank_name_group,rank_name,datas},function (res) {
                    if(res.success)
                        Spider.logout(rank_name+"微信公众号列表推送完成");
                    else
                        Spider.logout(rank_name+"微信公众号列表推送失败",'error');
                });

                public_list=datas;
                $.publish('newrank_weixin_detail_start', {
                    index: 0,
                    rank_name,
                    group_data:msg
                });
            }else
                Spider.logout(rank_name+"微信公众号列表读取失败",'error');
        });
    }else{
        Spider.logout("微信分类列表读取完成");
        Spider.vue.start_text='开始';
        Spider.vue.start_loading=false;
    }
});

/**
 * 订阅获取公众号文章：给定公众号列表，每次一个公众号
 */
$.subscribe('newrank_weixin_detail_start', function(e, msg) {
    var len=public_list.length;
    if(msg.index<len) {
        var obj=public_list[msg.index];
        newrank.weixin.detail(obj.uuid, function (res) {
            var lastestArticle = res.value.lastestArticle;
            var topArticle = res.value.topArticle;
            //发送服务器
            if (lastestArticle) {
                Ap.request.post(app_config.default.pushStateAPI+"/weixin/article",{lastestArticle,topArticle,uuid:obj.uuid,name:obj.name},function (res) {
                    if(res.success)
                        Spider.logout(obj.name+"微信文章列表推送完成");
                    else
                        Spider.logout(obj.name+"微信文章列表推送失败",'error');
                });
            }else
                Spider.logout(obj.name+"微信文章列表读取失败",'error');
            msg.index=msg.index+1;
            setTimeout(function () {
                $.publish('newrank_weixin_detail_start', msg);
            },app_config.default.newrank.interval);
            Spider.logout(obj.name+"文件列表读取完成");
        });
    }else{
        Spider.logout( msg.rank_name+"文件列表读取完成");
        msg.group_data.index=msg.group_data.index+1;
        $.publish('newrank_weixin_list_start', msg.group_data);
    }
});

/**
 * 搜索文章
 */
$.subscribe('newrank_weixin_search_start', function(e, msg) {
    var param = msg.param;
    newrank.weixin.dataSearch(param, function (res) {
        var datas = res.value.datas;
        if (datas) {
            Spider.vue.searechs=datas;
        }else
            Spider.logout("文章搜索列表读取失败",'error');
    });
});