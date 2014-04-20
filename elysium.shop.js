(function($) {
    "use strict";
    $.elysiumShop = {
        options: {},
        init: function(options) {
            this.options = options;

            this.initMain();
            this.initFilterSlider();
            this.initElevateZoom();
            this.initLazyLoading();
            this.initGridList();
            this.initCompare();

        },
        initMain: function() {
            $('#selectPrductSort option').click(function() {
                location.assign($(this).val());
            });

            $('#nb_item').change(function() {

                if ($(this).val()) {
                    $.cookie('products_per_page', $(this).val(), {expires: 30, path: '/'});
                } else {
                    $.cookie('products_per_page', '', {expires: 0, path: '/'});
                }
                location.reload();
            });


            $('.dialog').on('click', 'a.dialog-close', function() {
                $(this).closest('.dialog').hide().find('.cart').empty();
                return false;
            });

            $(document).keyup(function(e) {
                if (e.keyCode == 27) {
                    $(".dialog:visible").hide().find('.cart').empty();
                }
            });

            $("#center_column").on('submit', '.product-list form.addtocart', function() {
                var f = $(this);
                if (f.data('url')) {
                    var d = $('#dialog');
                    var c = d.find('.cart');
                    c.load(f.data('url'), function() {
                        c.prepend('<a href="#" class="dialog-close">&times;</a>');
                        d.show();
                        if ((c.height() > c.find('form').height())) {
                            c.css('bottom', 'auto');
                        } else {
                            c.css('bottom', '15%');
                        }
                    });
                    return false;
                }
                $.post(f.attr('action') + '?html=1', f.serialize(), function(response) {
                    if (response.status == 'ok') {
                        var cart_total = $(".cart-total");
                        if ($(window).scrollTop() >= 35) {
                            cart_total.closest('#cart').addClass("fixed");
                        }
                        cart_total.closest('#cart').removeClass('empty');
                        if ($("table.cart").length) {
                            $(".content").parent().load(location.href, function() {
                                cart_total.html(response.data.total);

                            });
                        } else {
                            if (f.closest(".product-list").get(0).tagName.toLowerCase() == 'table') {
                                var origin = f.closest('tr');
                                var block = $('<div></div>').append($('<table></table>').append(origin.clone()));
                            } else {
                                var origin = f.closest('li');
                                var block = $('<div></div>').append(origin.html());
                            }
                            block.css({
                                'z-index': 10,
                                top: origin.offset().top,
                                left: origin.offset().left,
                                width: origin.width() + 'px',
                                height: origin.height() + 'px',
                                position: 'fixed',
                                overflow: 'hidden'
                            }).insertAfter(origin).animate({
                                top: cart_total.offset().top,
                                left: cart_total.offset().left,
                                width: 0,
                                height: 0,
                                opacity: 0.5
                            }, 500, function() {
                                $(this).remove();
                                cart_total.html(response.data.total);
                            });
                        }
                        if (response.data.error) {
                            alert(response.data.error);
                        }
                    } else if (response.status == 'fail') {
                        alert(response.errors);
                    }
                }, "json");
                return false;
            });



            $('.filters.ajax form input').change(function() {
                var f = $(this).closest('form');
                var url = '?' + f.serialize();
                $(window).lazyLoad && $(window).lazyLoad('sleep');
                $.get(url, function(html) {
                    var tmp = $('<div></div>').html(html);
                    $('#product-list').html(tmp.find('#product-list').html());
                    if (!!(history.pushState && history.state !== undefined)) {
                        window.history.pushState({}, '', url);
                    }
                    $(window).lazyLoad && $(window).lazyLoad('reload');
                    $(".compare .comparator").uniform();
                    $('ul.product_view').each(function(i) {
                        var cookie = $.cookie('tabCookie' + i);
                        if (cookie)
                            $(this).find('li').eq(cookie).addClass('current').siblings().removeClass('current')
                                    .parents('#center_column').find('#product_list').addClass('list').removeClass('grid').eq(cookie).addClass('grid').removeClass('list');
                    });
                });

            });

            $('#layered_form span.layered_close a').live('click', function(e) {
                if ($(this).html() == '<i class="icon-plus-sign"></i>') {
                    $('#' + $(this).attr('rel')).show(600);
                    $(this).html('<i class="icon-minus-sign"></i>');
                    $(this).parent().removeClass('closed');
                } else {
                    $('#' + $(this).attr('rel')).hide(600);
                    $(this).html('<i class="icon-plus-sign"></i>');
                    $(this).parent().addClass('closed');
                }
                e.preventDefault();
            });

            $('#product-gallery').bxSlider({
                pager: false,
                controls: true,
                minSlides: 1,
                maxSlides: 4,
                slideWidth: 80,
                infiniteLoop: false,
                moveSlides: 1,
                nextText: '',
                prevText: ''
            });

        },
        initFilterSlider: function() {
            if (!this.options.filter_slider) {
                return false;
            }
            $('#filter-slider').slider({
                range: true,
                min: 0,
                max: 100000,
                values: [0, 100000],
                slide: function(event, ui) {
                    var v = ui.values[0];
                    if (v == $(this).slider('option', 'min')) {
                        v = '';
                    }
                    $('.filters input[name="price_min"]').val(v);
                    v = ui.values[1];
                    if (v == $(this).slider('option', 'max')) {
                        v = '';
                    }
                    $('.filters input[name="price_max"]').val(v);
                },
                stop: function(event, ui) {
                    $('input[name="price_min"]').change();
                }
            });
            $(".filters input[name=price_min], .filters input[name=price_max]").change(function() {
                var min = parseFloat($(".filters input[name=price_min]").val());
                if (!min) {
                    min = $("#filter-slider").slider('option', 'min');
                }
                var max = parseFloat($(".filters input[name=price_max]").val());
                if (!max) {
                    max = $("#filter-slider").slider('option', 'max');
                }
                if (max >= min) {
                    $("#filter-slider").slider('option', 'values', [min, max]);
                }
            });
        },
        initElevateZoom: function() {
            if (!this.options.elevate_zoom) {
                return false;
            }
            
            $("#product-image").elevateZoom({
                zoomType: "window",
                cursor: "crosshair",
                zoomWindowFadeIn: 500,
                zoomWindowFadeOut: 750,
                gallery: "product-gallery",
                galleryActiveClass: "thumbActive",
                zoomWindowWidth: 400,
                borderSize: 1,
                borderColour: '#e5e5e5',
                lensOpacity: 0.7,
                scrollZoom: true,
                constrainType: 'width'
            });

            $("#product-image").bind("click", function(e) {
                var ez = $('#product-image').data('elevateZoom');
                $.fancybox(ez.getGalleryList());
                return false;
            });
        },
        initLazyLoading: function() {
            if (!this.options.lazyloading) {
                return false;
            }
            var paging = $('.lazyloading-paging');
            if (!paging.length) {
                return;
            }
            // check need to initialize lazy-loading
            var current = paging.find('li.selected');
            if (current.children('a').text() != '1') {
                return;
            }
            paging.hide();
            var win = $(window);

            // prevent previous launched lazy-loading
            win.lazyLoad('stop');

            // check need to initialize lazy-loading
            var next = current.next();
            if (next.length) {
                win.lazyLoad({
                    container: '#center_column',
                    load: function() {
                        win.lazyLoad('sleep');

                        var paging = $('.lazyloading-paging').hide();

                        // determine actual current and next item for getting actual url
                        var current = paging.find('li.selected');
                        var next = current.next();
                        var url = next.find('a').attr('href');
                        if (!url) {
                            win.lazyLoad('stop');
                            return;
                        }

                        var product_list = $('#product-list .product-list');
                        var loading = paging.parent().find('.loading').parent();
                        if (!loading.length) {
                            loading = $('<div><i class="icon16 loading"></i>Loading...</div>').insertBefore(paging);
                        }

                        loading.show();
                        $.get(url, function(html) {
                            var tmp = $('<div></div>').html(html);
                            product_list.append(tmp.find('#product-list .product-list').children());
                            var tmp_paging = tmp.find('.lazyloading-paging').hide();
                            paging.replaceWith(tmp_paging);
                            paging = tmp_paging;

                            // check need to stop lazy-loading
                            var current = paging.find('li.selected');
                            var next = current.next();
                            if (next.length) {
                                win.lazyLoad('wake');
                            } else {
                                win.lazyLoad('stop');
                            }

                            loading.hide();
                            tmp.remove();
                            $(".compare .comparator").uniform();
                        });
                    }
                });
            }
        },
        initGridList: function() {
            var $self = this;
            $('ul.product_view').each(function(i) {
                var cookie = $.cookie('tabCookie' + i) || $self.options.default_product_view;
                if (cookie)
                    $(this).find('li').eq(cookie).addClass('current').siblings().removeClass('current')
                            .parents('#center_column').find('#product_list').addClass('list').removeClass('grid').eq(cookie).addClass('grid').removeClass('list');
            });

            $('ul.product_view').delegate('li:not(.current)', 'click', function(i) {
                $(this).addClass('current').siblings().removeClass('current')
                        .parents('#center_column').find('#product_list').removeClass('grid').addClass('list').eq($(this).index()).addClass('grid').removeClass('list')
                var cookie = $.cookie('tabCookie' + i);
                if (cookie)
                    $(this).find('#product_list').eq(cookie).removeClass('grid').addClass('list').siblings().removeClass('list')
                var ulIndex = $('ul.product_view').index($(this).parents('ul.product_view'));
                $.cookie('tabCookie' + ulIndex, null);
                $.cookie('tabCookie' + ulIndex, $(this).index(), {expires: 365, path: '/'});
            });

        },
        initCompare: function() {
            $('.comparator').poshytip({
                followCursor: true,
                className: 'tip-darkgray',
                showOn: 'hover',
                alignTo: 'target',
                alignX: 'inner-left',
                offsetX: 0,
                offsetY: 5
            });
            var $self = this;
            $('.comparator').change(function() {
                var compare = $.cookie('shop_compare');
                if ($(this).prop('checked')) {
                    if (compare) {
                        compare += ',' + $(this).val();
                    } else {
                        compare = '' + $(this).val();
                    }
                    $(this).poshytip('update', $self.options.remove_from_compare);
                    if (compare.split(',').length > 1) {
                        var url = $("#bt_compare_bottom").attr('href').replace(/compare\/.*$/, 'compare/' + compare + '/');
                        $("#bt_compare_bottom").attr('href', url).show();
                        $(this).poshytip('update', '<a style="color:#FFF; text-decoration:underline;" href="' + $("#bt_compare_bottom").attr('href') + '">Сравнить ' + compare.split(',').length + '</a>', true);
                    }
                    $(this).closest('p').find('label').text($self.options.remove_from_compare);
                    $.cookie('shop_compare', compare, {expires: 30, path: '/'});
                } else {
                    if (compare) {
                        compare = compare.split(',');
                    } else {
                        compare = [];
                    }
                    var i = $.inArray($(this).val() + '', compare);
                    if (i != -1) {
                        compare.splice(i, 1)
                    }
                    if (compare.length > 1) {
                        var url = $("#bt_compare_bottom").attr('href').replace(/compare\/.*$/, 'compare/' + compare + '/');
                        $("#bt_compare_bottom").attr('href', url);
                    } else {
                        $("#bt_compare_bottom").hide();
                    }
                    if (compare) {
                        $.cookie('shop_compare', compare.join(','), {expires: 30, path: '/'});
                    } else {
                        $.cookie('shop_compare', null);
                    }
                    $(this).poshytip('update', $self.options.add_to_compare);
                    $(this).closest('p').find('label').text($self.options.add_to_compare);
                }
                return false;
            });
        }
    };
})(jQuery);