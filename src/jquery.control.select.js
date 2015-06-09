/**
 * 用户中心页 下拉组件
 * @param  {[type]} $){                 } [description]
 * @return {[type]}      [description]
 * @example
class active
    <div class="control-select" data-for="#month">
        <div class="control-select-title">Month</div>
        <i class="icon icon-triangle-down"></i>
        <ul class="control-select-options">
            <li class="control-select-option" data-checked="" data-value="1"><a href="javascript:">01</a><i class="icon icon-checked"></i></li>
            <li class="control-select-option" data-checked="" data-value="12"><a href="javascript:">12</a><i class="icon icon-checked"></i></li>
        </ul>
    </div>
    <select name="month" id="month"></select>
 */
! function($, plus_name) {
    // 为元素添加操作对象，操作对象是插件的方法和属性
    function setOpera($this, opt) {
        // 如果已添加了操作，退出
        if ($this.data(plus_name)) return false;
        // 状态 1 启用中 0禁用中
        var status = 1;
        // 操作对象
        var data = $.extend({
            // 移除
            // $ele.plus('destroy')
            destroy: function() {
                // TODO
                $this.data(plus_name, data = null);
            },
            // 禁用
            // $ele.plus('disable')
            disable: function() {
                if (status === 1) {
                    // TODO
                    this._disable();
                    status = 0;
                }
            },
            // 启用
            // $ele.plus('enable')
            enable: function(force) {
                if (status === 0) {
                    // TODO
                    this._enable();
                    status = 1;
                }
            },
            // 参数选项操作
            // $ele.plus('option')  返回插件操作对象
            // $ele.plus('option' ,'key')  返回操作对象对应key的一个值
            // $ele.plus('option' ,'key' ,'value')  设置操作对象对应key的一个值
            // $ele.plus('option' ,'object')  使用map设置操作对象
            option: function(arg1, arg2) {
                if (isUndefined(arg1)) return data;
                if ($.isPlainObject(arg1)) $.each(arg1, function(v, k) {
                    data[k] = v
                })
                if (isUndefined(arg2)) return data[arg1];
                data[arg1] = arg2;
            }
        }, opt);
        // 操作对象保存到元素中
        $this.data(plus_name, data);
        return data;
    }

    function isUndefined(vari) {
        return typeof vari == 'undefined';
    }
    var self = $.fn[plus_name] = function(opt) {
        // opt 为字符串时，进行插件操作，操作的方法为opt
        // 往后的参数将为方法的参数
        if (typeof opt == 'string') {
            var args = [].slice.call(arguments, 1),
                re;
            this.each(function() {
                var $this = $(this),
                    data = $this.data(plus_name);
                if (data) re = data[opt].apply(data, args);
                if (!isUndefined(re)) return false;
            });
            if (!isUndefined(re)) return re;
            return this;
        } else {
            opt = $.extend({}, self.setting, opt);
            return this.each(function() {
                var $this = $(this),
                    operaData = setOpera($this, opt);
                if (!operaData) return;

                // TODO
                var $options = $(opt.optionsEl, $this);
                var $option = $(opt.optionEl, $this);
                var $optionTpl = $option.eq(0);
                var $title =operaData.$title = $(opt.titleEl, $this);
                var placeholder = $title.text();
                var $select = $($this.data('for'));
                $select.data(plus_name ,$this);

                operaData.show = function() {
                    if(operaData.state === 1) return;
                    $this.trigger(plus_name+'.showbefore');
                    $this.addClass(opt.activeState);
                    $options[opt.showAction]('fast', function() {
                    });
                    operaData.state = 1;
                };

                operaData.hide = function() {
                    if(operaData.state === 0) return;
                    $this.trigger(plus_name+'.hidebefore');
                    $this.removeClass(opt.activeState);
                    $options[opt.hideAction]('fast', function() {
                    });
                    operaData.state = 0;
                };

                operaData.toggle = function(){
                    operaData[operaData.state !== 1?'show' : 'hide']();
                }

                // 初始化
                operaData.init = function(){
                    $title.html('<i>'+placeholder+'</i>');
                    var options = [];
                    $('option' ,$select).each(function(i ,v){
                        var $v = $(v);
                        var $newOption = $optionTpl.clone();
                        if(!(opt.initSet.call(operaData ,$newOption ,$v))) return true;
                        var checked = $v.attr('checked') || $v.prop('checked');
                        opt.optionInitSet($newOption ,$v);
                        $newOption.data('value' ,$v.prop('value'));
                        if(checked){
                            optionActive($newOption);
                        }
                        options.push($newOption);
                    });
                    $option.remove();
                    opt.optionsInitSet($options ,options);
                    $option = $(opt.optionEl, $this);
                    if($option.length) $optionTpl = $option.eq(0).clone().removeClass(opt.activeState);
                    operaData.$option = $option;
                    operaData.hide();
                };

                // 显示下拉
                function showEvent(e){
                    var $target = $(e.target);
                    if(!$options.is($target) && !$options.has($target).length){
                        operaData.toggle();
                    }
                 }
                operaData._enable= function(){
                    $('.control-select-touch' ,$this).on('click' ,showEvent);
                }
                operaData._disable= function(){
                    $('.control-select-touch' ,$this).off('click' ,showEvent);
                }

                // 失去焦点  window ie8- 不起作用  body 点击滚动条无效
                $('html').mousedown(function(e){
                    var $target = $(e.target);
                    if(!$target.is($this) && !$this.has($target).length){
                        operaData.hide();
                    }
                });

                // 选择
                $options.delegate(opt.optionEl ,'click' ,function(e){
                    e.preventDefault();
                    var $cur = $option.filter('.'+opt.activeState);
                    if(optionActive($(this))){
                        optionUnActive($cur);
                        operaData.hide();
                    }
                }).on('mousewheel DOMMouseScroll' ,function(e){
                    var E = e.originalEvent;
                    var d = (E.wheelDelta) ? E.wheelDelta / 120 : -(E.detail || 0) / 3;
                    $options.stop().animate({scrollTop:'-='+150*d});
                    e.preventDefault();
                });

                operaData.init();
                operaData._enable();
                if($this.is('[disabled]'))operaData.disable();

                // 选中option
                function optionActive($newOption){
                    if(opt.optionActiveSet.call(operaData ,$newOption)){
                        $newOption.addClass(opt.activeState);
                        $newOption.data('checked' ,true);
                        $title.text($newOption.text());
                        $select.val($newOption.data('value'));
                        $select.trigger('change');
                        return true;
                    }else{
                        return false;
                    }
                }
                // 取消选中
                function optionUnActive($newOption){
                    $newOption.removeClass(opt.activeState);
                    $newOption.data('checked' ,null);
                }
            });
        }
    };
    self.setting = {
        /*默认参数*/
        showAction: 'fadeIn',
        hideAction: 'fadeOut',
        activeState: 'active',
        titleEl: '.control-select-title',
        optionsEl: '.control-select-options:first',
        optionEl: '.control-select-option',

        // 初始化option 过滤 自定义 传入 $newOption $option
        // return false  过滤
        initSet:function($newOption ,$option){
            return $option.prop('value');
        },
        // 选择项 过滤 传入 $newOption
        // return false  过滤
        optionActiveSet : function($newOption){
            return true;
        },
        // option项初始化钩子
        optionInitSet: function($newOption ,$v){
            $('a' ,$newOption).text($v.text());
        },
        // options 插入钩子
        optionsInitSet: function($options ,options){
            $options.append(options);
        }
    };
}(jQuery, 'controlSelect');
