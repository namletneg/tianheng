(function ($) {
    // PC 图片滑动
    $.fn.carousel = function () {
        var $this = this,
            isCarousel = false,
            go = function (n) {
                var scaleW = $this.width(),
                    $div = $this.find('.carousel-body'),
                    $items = $div.find('.item'),
                    $dots = $this.find('.carousel-dot a'),
                    idx = $div.find('.active').index(),
                    direction = (n < idx) ? -1 : 1,  // 方向： -1 左， 1 右
                    len = $items.length;

                n = (n < 0) ? len - 1 : n;
                n = (n > len - 1) ? 0 : n;

                $dots.removeClass('active');
                $($dots[n]).addClass('active');

                $($items[n]).css('left', direction * scaleW);
                $($items[idx]).animate({
                    'left': -direction * scaleW
                }, 700, function () {
                    $(this).css('left', 0).removeClass('active');
                });
                $($items[n]).addClass('active').animate({
                    left: 0
                }, 700, function () {
                    isCarousel = false;
                });
            },
            init = function () {
                $this.on('click', '.pre', function () {
                    var n = $this.find('.carousel-body .active').index() - 1;

                    if (isCarousel) {
                        return false;
                    }
                    isCarousel = true;
                    go(n);
                }).
                    on('click', '.next', function () {
                        var n = $this.find('.carousel-body .active').index() + 1;

                        if (isCarousel) {
                            return false;
                        }
                        isCarousel = true;
                        go(n);
                    }).on('mouseover', '.carousel-dot a', function () {
                        var n = $(this).index();

                        if (isCarousel || $this.find('.carousel-body .active').index() === n) {
                            return false;
                        }
                        isCarousel = true;
                        go(n);
                    });
            };

        init();
    };

    // Mobile 图片滑动
    function Slider(id, subElement) {
        this.wrap = document.getElementById(id);
        this.subElement = subElement;
        this.scaleW = window.innerWidth;
        this.idx = 0;
        this.slide();
    }

    Slider.prototype = {
        constructor: Slider,
        slide: function () {
            var self = this,
                scale = self.scaleW,
                wrap = self.wrap,
                item = wrap.querySelectorAll(self.subElement),
                i, len, m,
                handlerStart = function (event) {
                    self.startX = event.targetTouches[0].pageX;
                    self.startY = event.targetTouches[0].pageY;
                    self.offsetX = 0;
                    self.startTime = new Date();
                },
                handlerMove = function (event) {
                    self.moveX = event.targetTouches[0].pageX;
                    self.moveY = event.targetTouches[0].pageY;
                    self.offsetX = self.moveX - self.startX;

                    if (Math.abs(self.moveY - self.startY) < Math.abs(self.moveX - self.startX)) {
                        event.preventDefault();
                        for (i = self.idx - 1, m = i + 3; i < m; i++) {
                            item[i] && (item[i].style.transform = 'translate3d(' + (scale * (i - self.idx) + self.offsetX) + 'px, 0, 0)') &&
                            ((item[i].style.webkitTransform = 'translate3d(' + (scale * (i - self.idx) + self.offsetX) + 'px, 0, 0)')) &&
                            (item[i].style.transition = 'none');
                        }
                    }
                },
                handlerUp = function () {
                    var boundary = scale / 3,
                        endTime = new Date(),
                        distance = endTime.getTime() - self.startTime.getTime();    //时间间隔

                    if (distance >= 800) {
                        if (self.offsetX > boundary) {
                            self.go(-1);   //退一页
                        } else if (self.offsetX < -boundary) {
                            self.go(1);    //进一页
                        } else {
                            self.go(0);   //停留本页
                        }
                    } else {
                        //优化，
                        //快操作，考虑到用户快速滑动，滑动距离 小于 boundary
                        if (self.offsetX > 50) {
                            self.go(-1);   //退一页
                        } else if (self.offsetX < -50) {
                            self.go(1);    //进一页
                        } else {
                            self.go(0);   //停留本页
                        }
                    }
                };

            for (i = 0, len = item.length; i < len; i++) {
                item[i].style.webkitTransform = 'translate3d(' + i * scale + 'px, 0, 0)';
                item[i].style.transform = 'translate3d(' + i * scale + 'px, 0, 0)';
            }
            wrap.addEventListener('touchstart', handlerStart);
            wrap.addEventListener('touchmove', handlerMove);
            wrap.addEventListener('touchend', handlerUp);
        },
        go: function (n) {
            var self = this,
                scale = self.scaleW,
                wrap = self.wrap,
                item = wrap.querySelectorAll(self.subElement),
                len = item.length,
                nIdx = self.idx + n;

            //判断 nIdx 超出范围
            if (nIdx >= len) {
                nIdx = len - 1;
            } else if (nIdx < 0) {
                nIdx = 0;
            }
            self.idx = nIdx;
            item[self.idx] && (item[self.idx].style.transform = 'translate3d(0, 0, 0)') &&
            (item[self.idx].style.webkitTransform = 'translate3d(0, 0, 0)') &&
            (item[self.idx].style.transition = 'transform .3s linear 0s') &&
            (item[self.idx].style.webkitTransition = '-webkit-transform .3s linear 0s');

            item[self.idx - 1] && (item[self.idx - 1].style.transform = 'translate3d(' + (-scale) + 'px, 0, 0)') &&
            (item[self.idx - 1].style.webkitTransform = 'translate3d(' + (-scale) + 'px, 0, 0)') &&
            (item[self.idx - 1].style.transition = 'transform .3s linear 0s') &&
            (item[self.idx - 1].style.webkitTransition = '-webkit-transform .3s linear 0s');

            item[self.idx + 1] && (item[self.idx + 1].style.transform = 'translate3d(' + scale + 'px, 0, 0)') &&
            (item[self.idx + 1].style.webkitTransform = 'translate3d(' + scale + 'px, 0, 0)') &&
            (item[self.idx + 1].style.transition = 'transform .3s linear 0s') &&
            (item[self.idx + 1].style.webkitTransition = '-webkit-transform .3s linear 0s');

            var dots = wrap.querySelectorAll('.carousel-dot a');
            for (var i = 0; i < len; i++) {
                dots[i].className = '';
            }
            dots[self.idx].className = 'active';
        }
    };

    var $carousel = $('#carousel');
    if ($carousel.length && window.innerWidth <= 800) {
        new Slider('carousel', '.item');
    } else {
        $carousel.carousel();
    }

    var // 获取 el在 body 上的位置
        getPosition = function (option) {
            var el = option,
                x = 0,
                y = 0;

            do {
                x += el.offsetLeft;
                y += el.offsetTop;
            } while (el = el.offsetParent);  //若 el 的上层元素为绝对定位，则 el.offsetParent 为该元素；如没定位，追溯到上层定位元素，直至到 body
            return {
                x: x,
                y: y
            }
        },
    // nav显示
        showNav = function () {
            $('.header').on('click', '.touch', function(){
                $('ul.nav, .hot-line').toggle();
            });

            $(window).resize(function () {
                if(window.innerWidth > 800){
                    $('ul.nav, .hot-line').show();
                } else{
                    $('ul.nav, .hot-line').hide();
                }
            });
        },
    // 产品类别效果
        productAnimate = function () {
            var isOnly = false,
                effect = function (el) {
                    var space = 400;

                    $('.product').find('li').removeClass('animated bounce');
                    $(el).addClass('active').find('li').each(function (index) {
                        var _this = this;
                        setTimeout(function () {
                            $(_this).addClass('animated bounce');
                        }, space * index);
                    });
                },
                init = function () {
                    effect($('.product').find('ul')[0]);

                    $('#product_control').on('click', '.pre', function () {
                        var $div = $('.product').find('.active'),
                            $prev = $div.prev();

                        if (!$prev.length) {
                            return false;
                        }
                        $div.removeClass('active');
                        effect($prev);
                    }).
                        on('click', '.next', function () {
                            var $div = $('.product').find('.active'),
                                $next = $div.next();

                            if (!$next.length) {
                                return false;
                            }
                            $div.removeClass('active');
                            effect($next);
                        });
                };

            if ($('.product').length) {
                init();
            }
        },
    // 放大图片
        magnifyView = function () {
            $('body').on('click', '.btn-magnify', function () {
                var img = $(this).data('img'),
                    baseHTML = ['<div class="shade"></div>',
                        '<div class="model">',
                        '<a href="javascript:;" class="close" title="关闭">×</a>',
                        '<div class="magnify-img">',
                        '<img src="',
                        img,
                        '"/>',
                        '</div>',
                        '</div>'].join('');

                $('body').append(baseHTML);
            }).
                on('click', '.close,.shade', function () {
                    $('.shade, .model').remove();
                });
        },
    // 画布
        draw = function () {
            var $div = $('.transparent-bg'),
                $draw = $('.butou'),
                y, top;

            if ($div.length) {
                y = getPosition($div[0]).y;
                top = y - (1714 - $div.outerHeight());
                $draw.css('top', top);
                if (window.innerWidth > 800) {
                    $(window).on('scroll', function () {
                        var range = $(this).scrollTop() - (y - window.innerHeight + $div.outerHeight());

                        if (range > 0 && $(this).scrollTop() < y + $div.outerHeight()) {
                            $draw.css('top', top + range);
                        }
                    });
                }
            }
        },
    // 列表滚动
        rollList = function () {
            var isRolling = false,
                rolling = function (shifting) {
                    var $screen = $('.screen'),
                        left = parseInt($screen.css('margin-left')) + shifting,
                        range = 0;

                    $screen.find('.qa').each(function () {
                        range += parseInt($(this).outerWidth());
                    });

                    if (0 < left || -range >= left) {
                        isRolling = false;
                        return false;
                    }
                    $screen.animate({
                        'margin-left': left
                    }, 500, function () {
                        isRolling = false;
                    });
                },
                init = function () {
                    var $screen = $('.screen'),
                        $item = $screen.find('.qa'),
                        scaleW = window.innerWidth - 10,
                        isPc = true;

                    if (window.innerWidth <= 800) {
                        isPc = false;
                        $item.width(scaleW);
                    }

                    $('#question_control').on('click', '.pre', function () {
                        var left = isPc ? 1170 : scaleW;

                        if (isRolling) {
                            return false;
                        }
                        isRolling = true;
                        rolling(left);
                    }).
                        on('click', '.next', function () {
                            var left = isPc ? 1170 : scaleW;

                            if (isRolling) {
                                return false;
                            }
                            isRolling = true;
                            rolling(-left);
                        });

                    $(window).resize(function () {
                        if (window.innerWidth <= 800) {
                            scaleW = window.innerWidth - 10;
                            $item.width(scaleW);
                        }
                    });
                };

            if ($('.question').length) {
                init();
            }
        },
    // 产品图片展示
        screen = function () {
            var $div = $('.screen'),
                $box;

            if ($div.length) {
                $box = $div.find('.box');

                $div.on('mouseover', '.list .item', function () {
                    var src = $(this).find('img').attr('src');

                    $box.html('<img src="' + src + '"/>');
                }).
                    on('touchstart', '.list .item', function () {
                        var src = $(this).find('img').attr('src');

                        $box.html('<img src="' + src + '"/>');
                    });
            }
        };

    // nav显示
    showNav();
    // 产品类别效果
    productAnimate();
    // 放大图片
    magnifyView();
    // 画布
    draw();
    // 列表滚动
    rollList();
    // 产品图片展示
    screen();

})(jQuery);