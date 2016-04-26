(function ($) {
    // PC ͼƬ����
    $.fn.carousel = function () {
        var $this = this,
            isCarousel = false,
            go = function (n) {
                var scaleW = $this.width(),
                    $div = $this.find('.carousel-body'),
                    $items = $div.find('.item'),
                    $dots = $this.find('.carousel-dot a'),
                    idx = $div.find('.active').index(),
                    direction = (n < idx) ? -1 : 1,  // ���� -1 �� 1 ��
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

    // Mobile ͼƬ����
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
                        distance = endTime.getTime() - self.startTime.getTime();    //ʱ����

                    if (distance >= 800) {
                        if (self.offsetX > boundary) {
                            self.go(-1);   //��һҳ
                        } else if (self.offsetX < -boundary) {
                            self.go(1);    //��һҳ
                        } else {
                            self.go(0);   //ͣ����ҳ
                        }
                    } else {
                        //�Ż���
                        //����������ǵ��û����ٻ������������� С�� boundary
                        if (self.offsetX > 50) {
                            self.go(-1);   //��һҳ
                        } else if (self.offsetX < -50) {
                            self.go(1);    //��һҳ
                        } else {
                            self.go(0);   //ͣ����ҳ
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

            //�ж� nIdx ������Χ
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

    var //��ȡ el�� body �ϵ�λ��
        getPosition = function (option) {
            var el = option,
                x = 0,
                y = 0;

            do {
                x += el.offsetLeft;
                y += el.offsetTop;
            } while (el = el.offsetParent);  //�� el ���ϲ�Ԫ��Ϊ���Զ�λ���� el.offsetParent Ϊ��Ԫ�أ���û��λ��׷�ݵ��ϲ㶨λԪ�أ�ֱ���� body
            return {
                x: x,
                y: y
            }
        },
    // ��Ʒ���Ч��
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

                    $(window).on('scroll', function () {
                        var $div = $('.product'),
                            top = getPosition($div[0]).y - 500;

                        if (this.scrollY > top) {
                            if (!isOnly) {
                                isOnly = true;
                                effect($div.find('ul')[0])
                            }
                        }
                    });
                };

            if ($('.product').length) {
                init();
            }
        },
    // �Ŵ�ͼƬ
        magnifyView = function () {
            $('body').on('click', '.btn-magnify', function () {
                var img = $(this).data('img'),
                    baseHTML = ['<div class="shade"></div>',
                        '<div class="model">',
                        '<a href="javascript:;" class="close" title="�ر�">��</a>',
                        '<div class="magnify-img">',
                        '<img src="',
                        img,
                        '"/>',
                        '</div>',
                        '</div>'].join('');
            });
        };

    // ��Ʒ���Ч��
    productAnimate();
})(jQuery);