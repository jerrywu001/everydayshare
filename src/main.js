import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import ajax from './ajax';
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import 'muse-ui/dist/theme-carbon.css';
Vue.use(MuseUI);

function resetNavActiveStatus(path) {
    setTimeout(function () {
        let $lis = $('.mu-item');
        if ($lis.length) {
            $lis.removeClass('selected');
            switch (path) {
                case '/view':
                    $lis.eq(0).addClass('selected');
                    break;
                case '/peoples':
                    $lis.eq(1).addClass('selected');
                    break;
                case '/account':
                    $lis.eq(2).addClass('selected');
                    break;
                case '/user':
                    $lis.eq(2).addClass('selected');
                    break;
                case '/leave':
                    $lis.eq(3).addClass('selected');
                    break;
                case '/admins':
                    $lis.eq($lis.length - 7).addClass('selected');
                    break;
                case '/import':
                    $lis.eq($lis.length - 6).addClass('selected');
                    break;
                case '/email':
                    $lis.eq($lis.length - 5).addClass('selected');
                    break;
                case '/rules':
                    $lis.eq($lis.length - 4).addClass('selected');
                    break;
                case '/init':
                    $lis.eq($lis.length - 3).addClass('selected');
                    break;
                case '/holiday':
                    $lis.eq($lis.length - 2).addClass('selected');
                    break;
                case '/work':
                    $lis.eq($lis.length - 1).addClass('selected');
                    break;
                default:
                    $lis.eq(0).addClass('selected');
                    break;
            }
        }
    }, 288);
}

router.beforeEach((to, from, next) => {
    let notNeedLoginPages = ['/', '/view', '/account'];
    if (to.matched.some(to => {
            return to.meta.needLogin == undefined ? true : to.meta.needLogin
        })) {
        axios.get('/api/v1/login/check').then(function (rsp) {
            if (rsp.status === 200 && rsp.data.success) {
                store.commit('userInfo', rsp.data);
                if (!store.state.userInfo.role && ['/peoples'].indexOf(to.path) > -1) { ///peoples 只有admin账号可以访问
                    next({
                        path: '/view'
                    });
                    return false;
                } else {
                    next();
                }
            } else {
                if (notNeedLoginPages.indexOf(to.path) === -1) {
                    next({
                        path: '/login',
                        query: {
                            next_url: decodeURIComponent(to.path)
                        }
                    });
                } else {
                    next();
                }
            }
        });
    } else { //不需要登录时，也要检查用户登录状态，以设置用户信息
        axios.get('/api/v1/login/check').then(function (rsp) {
            if (rsp.status === 200 && rsp.data.success) {
                store.commit('userInfo', rsp.data);
            } else {
                store.commit('userInfo', {});
            }
            next();
        }, (error) => {
            store.commit('userInfo', {});
            next();
        });
    }
    resetNavActiveStatus(to.path);
});

Vue.config.productionTip = false;

Vue.prototype.$ajax = ajax;

Vue.prototype.sysTipTime = 2000;

Vue.prototype.showLoading = function () {
    $("body").append("<div id='gloading' class='gloading'></div>");
};

Vue.prototype.hideLoading = function () {
    $("body").find("#gloading").remove();
};

Vue.prototype.isShowLoading = function () {
    return $("#gloading") && $("#gloading").length;
};

Vue.prototype.trim = function (str) {
    if (!str) return '';
    return str.replace(/(^\s*)|(\s*$)/g, '');
};

Vue.prototype.isEmpty = function (str) {
    var length = str.replace(/(^\s*)|(\s*$)/g, "").length;
    if (length == 1 && str.charCodeAt(0) == '8203') { //处理 换行控制符
        length = 0;
    }
    return length == 0;
};

//时间格式化
Vue.prototype.format = function (date, fmt) { //author: meizz 
    var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "h+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

Vue.prototype.addStyleLink = function (path, id) {
    if (!!document.getElementById(id)) {
        return;
    }
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = path;
    link.id = id;
    document.getElementsByTagName("head")[0].appendChild(link);
};

Vue.prototype.addScriptLink = function (path, id) {
    if (!!document.getElementById(id)) {
        return;
    }
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = path;
    script.id = id;
    document.getElementsByTagName("head")[0].appendChild(script);
};

Vue.prototype.isParent = function (obj, parentObj) {
    if (!parentObj)
        return false;
    while (obj != undefined && obj != null && !!obj.tagName && obj.tagName.toUpperCase() != 'BODY') {
        if (obj == parentObj) {
            return true;
        }
        obj = obj.parentNode;
    }
    return false;
};

//"yyyy-MM-dd hh:mm:ss" 转化为 DateTime
Vue.prototype.dateStrToDate = function (dateStr) {
    if (!!dateStr) {
        return new Date(dateStr.replace(/-/g, '/'));
    }
};

Vue.prototype.getRootPath = function () {
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht = curWwwPath.substring(0, pos);
    if (pos === 5) localhostPaht = curWwwPath;
    if (localhostPaht.indexOf("file") != -1) {
        return ".";
    }
    //获取带"/"的项目名，如：/uimcardprj
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return (localhostPaht + projectName);
};

new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {
        App
    }
});
