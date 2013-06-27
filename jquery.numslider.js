;(function($) {

    $.fn.numSlider = function() {

        var _this = $(this),
            module,
            progress,
            val,
            pageX;

        module = {
            _build: (function() {
                if (!_this.hasClass('ns_loaded')) {
                    _this.addClass('ns_loaded')
                        .after('<div class="ns_track"><div class="ns_progress"><div class="ns_grabber"/></div></div>');
                }
            })(),
            defaultValue: _this.val(),
            field: _this,
            id: _this.attr('id'),
            interval: (function(){
                if (_this.attr('step')) {
                    return _this.attr('step');
                } else {
                    return 1;
                }
                })(),
            lowerLimit: (function(){
                    if (_this.attr('min')) {
                        return parseInt(_this.attr('min'),10);
                    } else {
                        return 0;
                    }
                })(),
            upperLimit: (function(){
                if (_this.attr('max')) {
                    return parseInt(_this.attr('max'),10);
                } else {
                    return 100;
                }
            })(),
            val: (function(){
                if (_this.val()) {
                    return parseInt(_this.val(),10);
                } else {
                    return 0;
                }
            })()
        };

        module.track = module.field.siblings('.ns_track');
        module.progressbar = module.track.children('.ns_progress');
        module.grabber = module.progressbar.children('.ns_grabber');

        module.grabber.bind('mousedown touchstart',function(e){
            e.preventDefault();
            ns_grab(module);
        });

        function ns_release(module) {
            $(document.body).removeClass('ns_moving').unbind('mousemove touchmove');
            module.field.removeClass('ns_active');
            module.val = module.field.val();
        }

        function ns_grab(module) {

            module.leftOffset = module.track.offset().left;
            module.rightOffset = module.track.outerWidth() + module.leftOffset;

            $(document.body).bind('mousemove touchmove', function(e){
                ns_move(module,e);
            });

        }

        function ns_updateSliderPosition(module) {

            var progress = module.val;

            if (progress > 100) {
                progress = 100;
            } else if (progress < 0) {
                progress = 0;
            }

            module.progressbar.css({
                width: progress+'%'
            });

        }

        function ns_move(module,e) {

            e.preventDefault();

            if (e.originalEvent.touches) {
                pageX = e.originalEvent.touches[0].pageX;
            } else if (e.originalEvent.pageX) {
                pageX = e.originalEvent.pageX;
            } else {
                pageX = e.pageX;
            }

            progress = (pageX - module.leftOffset) / (module.rightOffset - module.leftOffset) * 100;

            val = Math.round(((progress * (module.upperLimit - module.lowerLimit)/100) + module.lowerLimit)/ module.interval) * module.interval;

            if (val > module.upperLimit) {
                val = module.upperLimit;
            } else if (val < module.lowerLimit) {
                val = module.lowerLimit;
            }

            module.val = val;

            module.field.val(val).trigger('change');
        }

        module.field.bind('change keyup',function(){
            module.val = module.field.val();
            ns_updateSliderPosition(module);
        });

        module.track.bind('mousedown touchstart',function(e){
            ns_grab(module);
            ns_move(module,e);
            $(document.body).bind('mouseup touchend',function(){
                ns_release(module);
            }).addClass('ns_moving');
            module.field.addClass('ns_active');
        });

        ns_updateSliderPosition(module,module.val);

    };

})(jQuery);