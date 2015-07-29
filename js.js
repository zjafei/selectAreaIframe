/**
 * User: Eric Ma
 * Email: zjafei@gmail.com
 * Date: 2015/5/26
 * Time: 21:54
 */
define(function (require, exports, module) {
    var dialogPlus = require('dialogPlus');

    module.exports = function (callback, haveSelect) {
        var hs = [],
            cb = function () {
            };
        if (typeof  haveSelect === "object" && haveSelect.length > 0) {
            hs = haveSelect;
        }
        if (typeof callback === "function") {
            cb = callback;
        }
        _SELECTAREA = dialogPlus({
            title: '新增地区',
            padding: 10,
            url: seajs.data.base + 'modules/widget/selectArea/index.html',
            fixed: true,
            width: 650,
            setUp: {
                callback: cb,
                haveSelect: hs
            }
        });
        _SELECTAREA.showModal();
    };
});