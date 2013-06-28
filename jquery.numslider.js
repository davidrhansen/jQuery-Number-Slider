;(function($) {

    $.fn.numSlider = function() {

        $(this).each(function(){

            var _this = $(this),
                module,
                val,
                pageX,
                markup;
                
            markup = '<div class="ns_track"><div class="ns_progress"><div class="ns_grabber"/></div></div>';

            module = {
                _build: (function() {
                    if (!_this.hasClass('ns_loaded')) {
                        _this.addClass('ns_loaded').after(markup);
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

            module.track = module.field.next('.ns_track');
            module.progressbar = module.track.children('.ns_progress');
            module.grabber = module.progressbar.children('.ns_grabber');

            module.progress = (module.val - module.lowerLimit) / (module.upperLimit - module.lowerLimit) * 100;

            module.field.bind('change keyup',function(){
                module.val = module.field.val();
                module.progress = (module.val - module.lowerLimit) / (module.upperLimit - module.lowerLimit) * 100;
                ns_updateSliderPosition(module);
            });

            module.track.bind('mousedown touchstart',function(e){
                ns_grab(module,e);
            });

            function ns_release(module) {
                $(document.body).removeClass('ns_moving').unbind('mousemove touchmove');
                module.field.removeClass('ns_active');
                module.val = module.field.val();
            }

            function ns_grab(module,e) {
            
                module.leftOffset = module.track.offset().left;
                module.rightOffset = module.track.outerWidth() + module.leftOffset;

                ns_move(module,e);

                $(document.body)
                    .addClass('ns_moving')
                    .bind('mousemove touchmove', function(e){
                        ns_move(module,e);
                    })
                    .bind('mouseup touchend',function(){
                        ns_release(module);
                    });

                module.field.addClass('ns_active');
            }

            function ns_updateSliderPosition(module) {

                if (module.progress > 100) {
                    module.progress = 100;
                } else if (module.progress < 0) {
                    module.progress = 0;
                }

                module.progressbar.css({
                    width: module.progress+'%'
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

                module.progress = (pageX - module.leftOffset) / (module.rightOffset - module.leftOffset) * 100;

                val = Math.round(((module.progress * (module.upperLimit - module.lowerLimit)/100) + module.lowerLimit)/ module.interval) * module.interval;

                if (val > module.upperLimit) {
                    val = module.upperLimit;
                } else if (val < module.lowerLimit) {
                    val = module.lowerLimit;
                }

                module.val = val;

                module.field.val(val).trigger('change');
            }

            ns_updateSliderPosition(module);

        });

    };

})(jQuery);