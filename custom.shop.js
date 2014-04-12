$(document).ready(function() {

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
});
