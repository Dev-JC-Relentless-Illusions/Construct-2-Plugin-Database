;(function($, window, document, undefined) {
    var pluginName = 'circleMenu',
    defaults = {
        angle: {
            start: 0,
            end: 90
        },
        circle_radius: 80,
        delay: 1000,
        depth: 0,
        item_diameter: 30,
        speed: 500,
        step_in: -20,
        step_out: 20,
        transition_function: 'ease',
        trigger: 'hover'
    };

    function vendorPrefixes(items, prop, value) {
        ['-webkit-','-moz-','-o-','-ms-',''].forEach(function(prefix) {
            items.css(prefix+prop, value);
        });
    };

    function CircleMenu(element, options) {
        this._delete = [];
        this._state = 'closed';
        this._timeouts = [];
        this.element = $(element);
        this.options = $.extend({}, defaults, options);
        this.update();
        this.hook();
    };

    CircleMenu.prototype.trigger = function() {
        var args = [];
        for(var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        };
        this.element.trigger(pluginName+'-'+args.shift(), args);
    };

    CircleMenu.prototype.hook = function() {
        var self = this;

        if(self.options.trigger === 'hover') {
            self.element.on('mouseenter', function() {
                if(self._state === 'open' && !self._delete.length) self.clearTimeouts();
                else if(self._state === 'closed') self.open();
            }).on('mouseleave', function() {
                self.close(false, true);
            });
        } else if(self.options.trigger === 'click') {
            self.element.children('li:first-child').on('click', function(evt) {
                evt.preventDefault();
                if(self._state === 'closed') self.open();
                else if(self._state === 'open') self.close(false, true);
                return false;
            });
        } else if(self.options.trigger === 'none') { /* Do nothing */ };
    };

    CircleMenu.prototype.clearTimeouts = function() {
        var timeout;
        while(timeout = this._timeouts.shift()) {
            clearTimeout(timeout);
        };
    };

    CircleMenu.prototype.initCss = function(immediate) {
        var self = this, $items = self.element.children('li');

        self.element.removeClass(pluginName+'-open');
        self.element.css({
            'list-style': 'none',
            'margin': 0,
            'padding': 0,
            'width': self.options.item_diameter+'px'
        });
        
        $items.css({
            'display': 'block',
            'width': self.options.item_diameter+'px',
            'height': self.options.item_diameter+'px',
            'text-align': 'center',
            'line-height': self.options.item_diameter+'px',
            'position': 'absolute',
            'z-index': 1
        });

        self.element.children('li:first-child').css({'z-index': 1000 - self.options.depth});
        self.menu_items.css({top: 0, left: 0});

        vendorPrefixes($items, 'border-radius', self.options.item_diameter+'px');
        vendorPrefixes(self.menu_items, 'transform', 'scale(.5)');
        if(immediate) {
            vendorPrefixes(self.menu_items, 'transition', 'all 0ms '+self.options.transition_function);
            setTimeout(function() {
                vendorPrefixes($items, 'transition', 'all '+self.options.speed+'ms '+self.options.transition_function);
                vendorPrefixes($items, 'opacity', '');
            }, 50);
        } else {
            vendorPrefixes($items, 'transition', 'all '+self.options.speed+'ms '+self.options.transition_function);
            setTimeout(function() { vendorPrefixes($items, 'opacity', ''); }, self.options.speed);
        };
    };

    CircleMenu.prototype.update = function() {
        var self = this, dir,
        directions = {
            'bottom-left':[180,90],
            'bottom':[135,45],
            'right':[-45,45],
            'left':[225,135],
            'top':[225,315],
            'bottom-half':[180,0],
            'right-half':[-90,90],
            'left-half':[270,90],
            'top-half':[180,360],
            'top-left':[270,180],
            'top-right':[270,360],
            'full':[-90,270-Math.floor(360/(self.element.children('li').length - 1))],
            'bottom-right':[0,90]
        };

        self.element.addClass(pluginName+'-closed');

        if(typeof self.options.direction === 'string') {
            dir = directions[self.options.direction.toLowerCase()];
            if(dir) {
                self.options.angle.start = dir[0];
                self.options.angle.end = dir[1];
            };
        };

        self.menu_items = self.element.children('li:not(:first-child)');
        self.initCss();
        self._step = (self.options.angle.end - self.options.angle.start) / (self.menu_items.length-1);
        self.menu_items.each(function(i) {
            var $item = $(self.menu_items[i]);
                angle = (self.options.angle.start + (self._step * i)) * (Math.PI/180),
                x = Math.round(self.options.circle_radius * Math.cos(angle)),
                y = Math.round(self.options.circle_radius * Math.sin(angle));

            $item.data('plugin_'+pluginName+'-pos-x', x);
            $item.data('plugin_'+pluginName+'-pos-y', y);
            if(self.options.trigger === 'hover') {
                $item.on('mouseenter', function() {
                    if(self._state === 'open' && !self._delete.length) self.clearTimeouts();
                }).on('mouseleave', function() {
                    self.close(false, true);
                });
            };
            if(i === self.menu_items.length - 1) {
                $item.on('click', function() {
                    self.select($item.index() + 1);
                });
            };
        });

        // Initialize event hooks from options
        ['update','open','close','select','delete','clear'].forEach(function(evt) {
            if(self.options[evt]) {
                self.element.on(pluginName+'-'+evt, function() {
                    return self.options[evt].apply(self, arguments);
                });
                delete self.options[evt];
            };
        });

        self.submenus = self.menu_items.children('ul');
        self.submenus.circleMenu($.extend({}, self.options, {depth: self.options.depth + 1}));
        self._state = 'closed';
        self.trigger('update');
    };

    CircleMenu.prototype.open = function() {
        if(this._state != 'closed' || this._delete.length)
            return this;
        /////////////////////////////////////
        var self = this, set = self.options.step_out >= 0 ? self.menu_items : $(self.menu_items.get().reverse());
        self.clearTimeouts();
        self._state = 'opening';
        set.each(function(index) {
            var $item = $(this);
            self._timeouts.push(setTimeout(function() {
                $item.css({
                    left: $item.data('plugin_'+pluginName+'-pos-x')+'px',
                    top: $item.data('plugin_'+pluginName+'-pos-y')+'px'
                });
                vendorPrefixes($item, 'transform', 'scale(1)');
            }, Math.abs(self.options.step_out) * index));
        });

        self._timeouts.push(setTimeout(function() {
            if(self._state === 'opening') self._state = 'open';
            self.trigger('open');
        }, Math.abs(self.options.step_out) * set.length));

        self.element.removeClass(pluginName+'-closed');
        self.element.addClass(pluginName+'-open');
        return self;
    };

    CircleMenu.prototype.close = function(immediate, close) {
        if(this._state != 'open' && this._state != 'opening')
            return this;
        if(this._state === 'opening' && !close)
            return this;
        /////////////////////////////////////
        var self = this,
            do_animation = function do_animation() {
                self.clearTimeouts();
                if(self._state != 'clear') self._state = 'closing';
                self.submenus.circleMenu('close');
                var set = self.options.step_in >= 0 ? self.menu_items : $(self.menu_items.get().reverse());
                set.each(function(index) {
                    var $item = $(this);
                    self._timeouts.push(setTimeout(function() {
                        $item.css({top:0,left:0});
                        vendorPrefixes($item, 'transform', 'scale(.5)');
                    }, Math.abs(self.options.step_in) * index));
                });
                /////////////////////////////////////
                self._timeouts.push(setTimeout(function() {
                    self.trigger('close');
                }, Math.abs(self.options.step_in) * set.length));
                self._timeouts.push(setTimeout(function() {
                    if(self._state === 'closing' && close) self._state = 'closed';
                }, Math.abs(self.options.step_in) * set.length + self.options.speed));
                /////////////////////////////////////
                self.element.removeClass(pluginName+'-open');
                self.element.addClass(pluginName+'-closed');
                return self;
            };

        if(immediate)
            do_animation();
        else {
            var speed = self._state === 'opening' ? (Math.abs(self.options.step_out) * self.menu_items.length) + self.options.speed : 0;
            self._timeouts.push(setTimeout(function() { do_animation(); }, self.options.delay + speed));
        };
        return self;
    };

    CircleMenu.prototype.select = function(index) {
        var self = this, selected, set_other;

        if(self._state === 'open') {
            self.clearTimeouts();
            self._state = 'select';
            set_other = self.element.children('li:not(:nth-child('+index+'),:first-child)');
            selected = self.element.children('li:nth-child('+index+')');

            vendorPrefixes(selected.add(set_other), 'transition', 'all 500ms ease-out');
            vendorPrefixes(selected, 'transform', 'scale(2)');
            vendorPrefixes(set_other, 'transform', 'scale(0)');
            selected.css('opacity', '0');
            set_other.css('opacity', '0');
            self.element.removeClass(pluginName+'-open');

            setTimeout(function() {
                self._state = 'closed';
                self.initCss(true);
                self.trigger('select', index - 2);
            }, 500);
        };
    };

    CircleMenu.prototype.delete = function(index) {
        if(this._state === 'clear')
            return this;
        /////////////////////////////////////
        var self = this, speed = 0;
        if(!self._delete.length) {
            self._delete.push(index);

            if(self._state != 'closed') {
                if(self._state === 'opening') speed = (Math.abs(self.options.step_out) * self.menu_items.length) + self.options.speed + self.options.delay;
                speed += (Math.abs(self.options.step_in) * self.menu_items.length) + self.options.speed;
                self.close(true, false);
            };

            setTimeout(function() {
                while(self._delete.length) {
                    $(self.element).find('li:eq('+self._delete[0]+')').remove();
                    self.trigger('delete', self._delete[0]);
                    self._delete.splice(0, 1);
                };
                self.update();
            }, speed);
        } else {
            for(var i = 0; i < self._delete.length; i++) { if(index > self._delete[i]) index--; };
            self._delete.push(index);
        };
    };

    CircleMenu.prototype.clear = function() {
        var self = this, speed = 0;

        if(self._state != 'closed') {
            if(self._state === 'opening') speed = (Math.abs(self.options.step_out) * self.menu_items.length) + self.options.speed + self.options.delay;
            speed += (Math.abs(self.options.step_in) * self.menu_items.length) + self.options.speed;
            self.close(true, false);
        };

        self._state = 'clear';
        setTimeout(function() {
            $(self.element).find('li:not(:first-child)').remove();
            self.update();
            self.trigger('clear');
        }, speed);
    };

    $.fn[pluginName] = function(options, evt) {
        return this.each(function() {
            var obj = $.data(this, 'plugin_'+pluginName),
                commands = {
                'update':function() {obj.update();},
                'open':function() {obj.open();},
                'close':function() {obj.close();},
                'delete':function() {obj.delete(evt);},
                'clear':function() {obj.clear();}
            };
            if(typeof options === 'string' && obj && commands[options]) {
                commands[options]();
            }
            if(!obj) {
                $.data(this, 'plugin_' + pluginName, new CircleMenu(this, options));
            }
        });
    };
})(jQuery, window, document);