/**
 * User: Eric Ma
 * Email: zjafei@gmail.com
 * Date: 2015/5/27
 * Time: 10:41
 */
define(function (require, exports, module) {
    var $body = $('body');

    //创建单个区域html结构
    function createAreaHtml(obj, level, pid) {
        var areaListHtml = '',
            moreHtml = '';

        if (typeof obj.son !== "undefined" && obj.son.length > 0) {
            areaListHtml = '<div class="area-list"  i="' + obj.id + '" p="' + pid + '"></div>';
            moreHtml = ' <span class="js-select-area-more glyphicon glyphicon-triangle-bottom" i="' + obj.id + '" p="' + pid + '"></span>';
        }
        return '<div class="area-container" level="' + level + '" id="' + obj.id + '" p="' + pid + '">' +
            '<div class="area-head checkbox"  i="' + obj.id + '" p="' + pid + '">' +
            '<label>' +
            '<input class="js-select-area" type="checkbox" level="' + level + '" autocomplete="off" value="" i="' + obj.id + '" p="' + pid + '"> ' + obj.shortname +
            '</label>' +
            moreHtml +
            '</div>' +
            areaListHtml +
            '</div>'
    }
    //创建全部区域html结构
    function createAreaListHtml(areaAry, dom, level, pid) {
    //ajax获取地区json /index.php/Usercenter/Supply/getallarea.html
        $.each(areaAry, function () {
            dom.append(createAreaHtml(this, level, pid));
            if (typeof this.son === "object" && this.son.length > 0) {
                createAreaListHtml(this.son, $('.area-list[i="' + this.id + '"]'), level + 1, this.id);
            }
        });
        //$.ajax({
        //    type: "POST",
        //    url: '/index.php/Usercenter/Supply/getallarea.html',
        //    data: "id=" + getCheckedProductId(),
        //    dataType: "json",
        //    success: function (data) {
        //        switch (data.status) {
        //            case 1:
        //                $.each(data.arealist, function () {
        //                    dom.append(createAreaHtml(this, level));
        //                    if (this.son.length > 0) {
        //                        createAreaListHtml(this.son, $('.area-list[i="' + this.id + '"]'), level + 1);
        //                    }
        //                });
        //                break;
        //            case 0:
        //                alert(data.info);
        //                break;
        //        }
        //    }
        //});
    }

    //根据修改指定ID的checked属性为true
    function checkedCheckbox(idAry) {
        if (idAry.length > 0) {
            $.each(idAry.length, function () {
                $('.js-select-area[i="' + this + '"]').prop('checked', true);
            });
        }
    }

    //选择框对父级选择框的影响
    function parentCheckbox(pid) {
        if (pid !== '') {
            var allLength = $('.area-list[i="' + pid + '"] input[type="checkbox"][p="' + pid + '"]').length;//同级别的全部选择框
            var checkedLenght = $('.area-list[i="' + pid + '"] input[type="checkbox"][p="' + pid + '"]:checked').length;//同级别的选中的选择框
            var p = $('.js-select-area[i="' + pid + '"]');
            p.prop('checked', allLength === checkedLenght);
            var id = p.attr('p');
            if (id !== '') {//向上迭代父级选择框
                parentCheckbox(id);
            }
        }
    }

    //获取最末级被选中的选择框的ID数组
    function getLastCheckedAreaIdArray(dom) {
        var ary = [];
        $.each(dom, function () {
            var id = $(this).attr('i');
            //console.log($('#' + id + ' > .area-list').length);
            if ($('#' + id + ' > .area-list').length === 0) {
                ary.push(id);
            }
        });
        return ary;
    }

    //获取被选中的选择框的ID数组
    function getAllCheckedAreaIdArray(dom) {
        var ary = [];
        $.each(dom, function () {
            ary.push($(this).attr('i'));
        });
        return ary;
    }

    //获取被选中的选择框的名称数组
    function getAreaNameArray(dom, ary) {
        $.each(dom, function () {
            var myThis = $(this);
            var id = myThis.attr('i');

            if (myThis.prop('checked')) {
                ary.push(myThis.parent().text());
            } else {
                var list = $('.js-select-area[p ="' + id + '"]');
                if (list.length > 0) {
                    getAreaNameArray(list, ary);
                }
            }
        });
        return ary;
    }

    //通过json加载html
    createAreaListHtml(areaAry.arealist, $('#listContainer'), 0, '');
    $('.area-container[level="0"]:odd ').css({'background-color':'#ECF4FF'});
    //是否已经有选择
    //checkedCheckbox(top._SELECTAREA.setUp.haveSelect);

    //城市列表的显示与隐藏
    $body.on('click', '.js-select-area-more', function (e) {
        var id = $(this).attr('i');//自己的ID
        var curId = $('.cur').eq(0).attr('i');//原来显示的

        if (id === curId) {
            $('#' + id).removeAttr('style');
            $('.area-list[i="' + id + '"]').removeClass('cur').hide();
        } else {
            $('#' + curId).removeAttr('style');
            $('.area-list[i="' + curId + '"]').removeClass('cur').hide();
            $('.area-list[i="' + id + '"]').addClass('cur').show();
            $('#' + id).css({
                'z-index': '99'
            });
        }
        e.stopPropagation();
    });
    $body.on('click', '.cur', function (e) {
        e.stopPropagation();
    });
    $(document).click(function () {
        var curId = $('.cur').eq(0).attr('i');//原来显示的
        $('#' + curId).removeAttr('style');
        $('.area-list[i="' + curId + '"]').removeClass('cur').hide();
    });

    //选择框的点击动作
    $('.js-select-area').click(function () {
        var id = $(this).attr('i');//自己的ID
        var pid = $(this).attr('p');
        $('.area-list[i="' + id + '"] input[type="checkbox"]').prop('checked', this.checked);//子级全选或全不选
        parentCheckbox(pid);
    });

    $('#submit').click(function () {
        var checked = $('.js-select-area:checked');
        console.log(getLastCheckedAreaIdArray(checked));
        console.log(getAllCheckedAreaIdArray(checked));
        console.log(getAreaNameArray($('.js-select-area[level="0"]'), []));
    });
});