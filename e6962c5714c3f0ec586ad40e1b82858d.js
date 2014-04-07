
jQuery.easing['jswing'] = jQuery.easing['swing'];


function formatedNumberToFloat(price, currencyFormat, currencySign) {
    price = price.replace(currencySign, '');
    if (currencyFormat == 1)
        return parseFloat(price.replace(',', '').replace(' ', ''));
    else if (currencyFormat == 2)
        return parseFloat(price.replace(' ', '').replace(',', '.'));
    else if (currencyFormat == 3)
        return parseFloat(price.replace('.', '').replace(' ', '').replace(',', '.'));
    else if (currencyFormat == 4)
        return parseFloat(price.replace(',', '').replace(' ', ''));
    return price;
}

function formatNumber(value, numberOfDecimal, thousenSeparator, virgule) {
    value = value.toFixed(numberOfDecimal);
    var val_string = value + '';
    var tmp = val_string.split('.');
    var abs_val_string = (tmp.length == 2) ? tmp[0] : val_string;
    var deci_string = ('0.' + (tmp.length == 2 ? tmp[1] : 0)).substr(2);
    var nb = abs_val_string.length;
    for (var i = 1; i < 4; i++)
        if (value >= Math.pow(10, (3 * i)))
            abs_val_string = abs_val_string.substring(0, nb - (3 * i)) + thousenSeparator + abs_val_string.substring(nb - (3 * i));
    if (parseInt(numberOfDecimal) == 0)
        return abs_val_string;
    return abs_val_string + virgule + (deci_string > 0 ? deci_string : '00');
}

function formatCurrency(price, currencyFormat, currencySign, currencyBlank) {
    blank = '';
    price = parseFloat(price.toFixed(6));
    price = ps_round(price, priceDisplayPrecision);
    if (currencyBlank > 0)
        blank = ' ';
    if (currencyFormat == 1)
        return currencySign + blank + formatNumber(price, priceDisplayPrecision, ',', '.');
    if (currencyFormat == 2)
        return (formatNumber(price, priceDisplayPrecision, ' ', ',') + blank + currencySign);
    if (currencyFormat == 3)
        return (currencySign + blank + formatNumber(price, priceDisplayPrecision, '.', ','));
    if (currencyFormat == 4)
        return (formatNumber(price, priceDisplayPrecision, ',', '.') + blank + currencySign);
    if (currencyFormat == 5)
        return (formatNumber(price, priceDisplayPrecision, ' ', '.') + blank + currencySign);
    return price;
}

function ps_round(value, precision) {
    if (typeof (roundMode) == 'undefined')
        roundMode = 2;
    if (typeof (precision) == 'undefined')
        precision = 2;
    method = roundMode;
    if (method == 0)
        return ceilf(value, precision);
    else if (method == 1)
        return floorf(value, precision);
    precisionFactor = precision == 0 ? 1 : Math.pow(10, precision);
    return Math.round(value * precisionFactor) / precisionFactor;
}

function autoUrl(name, dest) {
    var loc;
    var id_list;
    id_list = document.getElementById(name);
    loc = id_list.options[id_list.selectedIndex].value;
    if (loc != 0)
        location.href = dest + loc;
    return;
}

function autoUrlNoList(name, dest) {
    var loc;
    loc = document.getElementById(name).checked;
    location.href = dest + (loc == true ? 1 : 0);
    return;
}

function toggle(e, show) {
    e.style.display = show ? '' : 'none';
}

function toggleMultiple(tab) {
    var len = tab.length;
    for (var i = 0; i < len; i++)
        if (tab[i].style)
            toggle(tab[i], tab[i].style.display == 'none');
}

function showElemFromSelect(select_id, elem_id) {
    var select = document.getElementById(select_id);
    for (var i = 0; i < select.length; ++i) {
        var elem = document.getElementById(elem_id + select.options[i].value);
        if (elem != null)
            toggle(elem, i == select.selectedIndex);
    }
}

function openCloseAllDiv(name, option) {
    var tab = $('*[name=' + name + ']');
    for (var i = 0; i < tab.length; ++i)
        toggle(tab[i], option);
}

function toggleElemValue(id_button, text1, text2) {
    var obj = document.getElementById(id_button);
    if (obj)
        obj.value = ((!obj.value || obj.value == text2) ? text1 : text2);
}

function addBookmark(url, title) {
    if (window.sidebar)
        return window.sidebar.addPanel(title, url, "");
    else if (window.external && ('AddFavorite' in window.external))
        return window.external.AddFavorite(url, title);
    else if (window.opera && window.print)
        return true;
    return true;
}

function writeBookmarkLink(url, title, text, img) {
    var insert = '';
    if (img)
        insert = writeBookmarkLinkObject(url, title, '<img src="' + img + '" alt="' + escape(text) + '" title="' + removeQuotes(text) + '" />') + '&nbsp';
    insert += writeBookmarkLinkObject(url, title, text);
    if (window.sidebar || window.opera && window.print || (window.external && ('AddFavorite' in window.external)))
        document.write(insert);
}

function writeBookmarkLinkObject(url, title, insert) {
    if (window.sidebar || window.external)
        return ('<a href="javascript:addBookmark(\'' + escape(url) + '\', \'' + removeQuotes(title) + '\')">' + insert + '</a>');
    else if (window.opera && window.print)
        return ('<a rel="sidebar" href="' + escape(url) + '" title="' + removeQuotes(title) + '">' + insert + '</a>');
    return ('');
}

function checkCustomizations() {
    var pattern = new RegExp(' ?filled ?');
    if (typeof customizationFields != 'undefined')
        for (var i = 0; i < customizationFields.length; i++) {
            if (parseInt(customizationFields[i][1]) == 1 && ($('#' + customizationFields[i][0]).html() == '' || $('#' + customizationFields[i][0]).text() != $('#' + customizationFields[i][0]).val()) && !pattern.test($('#' + customizationFields[i][0]).attr('class')))
                return false;
        }
    return true;
}

function emptyCustomizations() {
    if (typeof (customizationFields) == 'undefined') return;
    $('.customization_block .success').fadeOut(function () {
        $(this).remove();
    });
    $('.customization_block .error').fadeOut(function () {
        $(this).remove();
    });
    for (var i = 0; i < customizationFields.length; i++) {
        $('#' + customizationFields[i][0]).html('');
        $('#' + customizationFields[i][0]).val('');
    }
}

function ceilf(value, precision) {
    if (typeof (precision) == 'undefined')
        precision = 0;
    var precisionFactor = precision == 0 ? 1 : Math.pow(10, precision);
    var tmp = value * precisionFactor;
    var tmp2 = tmp.toString();
    if (tmp2.indexOf('.') === false)
        return (value);
    if (tmp2.charAt(tmp2.length - 1) == 0)
        return value;
    return Math.ceil(tmp) / precisionFactor;
}

function floorf(value, precision) {
    if (typeof (precision) == 'undefined')
        precision = 0;
    var precisionFactor = precision == 0 ? 1 : Math.pow(10, precision);
    var tmp = value * precisionFactor;
    var tmp2 = tmp.toString();
    if (tmp2.indexOf('.') === false)
        return (value);
    if (tmp2.charAt(tmp2.length - 1) == 0)
        return value;
    return Math.floor(tmp) / precisionFactor;
}


function isArrowKey(k_ev) {
    var unicode = k_ev.keyCode ? k_ev.keyCode : k_ev.charCode;
    if (unicode >= 37 && unicode <= 40)
        return true;
    return false;
}




$().ready(function () {
    $('form').submit(function () {
        $(this).find('.hideOnSubmit').hide();
    });
    $('a._blank').attr('target', '_blank');
});;










function HoverWatcher(selector) {
    this.hovering = false;
    var self = this;
    this.isHoveringOver = function () {
        return self.hovering;
    }
    $(selector).hover(function () {
        self.hovering = true;
    }, function () {
        self.hovering = false;
    })
}



$(document).ready(function () {
    $('#footer ul.tree ul').hide();
});;;




(function (a) {
    var b = a.serialScroll = function (c) {
        return a(window).serialScroll(c)
    };
    b.defaults = {
        duration: 1e3,
        axis: "x",
        event: "click",
        start: 0,
        step: 1,
        lock: !0,
        cycle: !0,
        constant: !0
    };
    a.fn.serialScroll = function (c) {
        return this.each(function () {
            var t = a.extend({}, b.defaults, c),
                s = t.event,
                i = t.step,
                r = t.lazy,
                e = t.target ? this : document,
                u = a(t.target || this, e),
                p = u[0],
                m = t.items,
                h = t.start,
                g = t.interval,
                k = t.navigation,
                l;
            if (!r) {
                m = d()
            }
            if (t.force) {
                f({}, h)
            }
            a(t.prev || [], e).bind(s, -i, q);
            a(t.next || [], e).bind(s, i, q);
            if (!p.ssbound) {
                u.bind("prev.serialScroll", -i, q).bind("next.serialScroll", i, q).bind("goto.serialScroll", f)
            }
            if (g) {
                u.bind("start.serialScroll", function (v) {
                    if (!g) {
                        o();
                        g = !0;
                        n()
                    }
                }).bind("stop.serialScroll", function () {
                    o();
                    g = !1
                })
            }
            u.bind("notify.serialScroll", function (x, w) {
                var v = j(w);
                if (v > -1) {
                    h = v
                }
            });
            p.ssbound = !0;
            if (t.jump) {
                (r ? u : d()).bind(s, function (v) {
                    f(v, j(v.target))
                })
            }
            if (k) {
                k = a(k, e).bind(s, function (v) {
                    v.data = Math.round(d().length / k.length) * k.index(this);
                    f(v, this)
                })
            }

            function q(v) {
                v.data += h;
                f(v, this)
            }

            function f(B, z) {
                if (!isNaN(z)) {
                    B.data = z;
                    z = p
                }
                var C = B.data,
                    v, D = B.type,
                    A = t.exclude ? d().slice(0, -t.exclude) : d(),
                    y = A.length,
                    w = A[C],
                    x = t.duration;
                if (D) {
                    B.preventDefault()
                }
                if (g) {
                    o();
                    l = setTimeout(n, t.interval)
                }
                if (!w) {
                    v = C < 0 ? 0 : y - 1;
                    if (h != v) {
                        C = v
                    } else {
                        if (!t.cycle) {
                            return
                        } else {
                            C = y - v - 1
                        }
                    }
                    w = A[C]
                }
                if (!w || t.lock && u.is(":animated") || D && t.onBefore && t.onBefore(B, w, u, d(), C) === !1) {
                    return
                }
                if (t.stop) {
                    u.queue("fx", []).stop()
                }
                if (t.constant) {
                    x = Math.abs(x / i * (h - C))
                }
                u.scrollTo(w, x, t).trigger("notify.serialScroll", [C])
            }

            function n() {
                u.trigger("next.serialScroll")
            }

            function o() {
                clearTimeout(l)
            }

            function d() {
                return a(m, p)
            }

            function j(w) {
                if (!isNaN(w)) {
                    return w
                }
                var x = d(),
                    v;
                while ((v = x.index(w)) == -1 && w != p) {
                    w = w.parentNode
                }
                return v
            }
        })
    }
})(jQuery);;
var cs_serialScrollNbImagesDisplayed;
var cs_serialScrollNbImages;
var cs_serialScrollActualImagesIndex;

function cs_serialScrollFixLock(event, targeted, scrolled, items, position) {
    serialScrollNbImages = $('#crossselling_list li:visible').length;
    serialScrollNbImagesDisplayed = 5;
    var leftArrow = position == 0 ? true : false;
    var rightArrow = position + serialScrollNbImagesDisplayed >= serialScrollNbImages ? true : false;
    $('a#crossselling_scroll_left').css('cursor', leftArrow ? 'default' : 'pointer').css('display', leftArrow ? 'none' : 'block').fadeTo(0, leftArrow ? 0 : 1);
    $('a#crossselling_scroll_right').css('cursor', rightArrow ? 'default' : 'pointer').fadeTo(0, rightArrow ? 0 : 1).css('display', rightArrow ? 'none' : 'block');
    return true;
}

$(document).ready(function () {
    if ($('#crossselling_list').length > 0) {
        cs_serialScrollNbImages = $('#crossselling_list li').length;
        cs_serialScrollNbImagesDisplayed = 5;
        cs_serialScrollActualImagesIndex = 0;
        $('#crossselling_list').serialScroll({
            items: 'li',
            prev: 'a#crossselling_scroll_left',
            next: 'a#crossselling_scroll_right',
            axis: 'x',
            offset: 0,
            stop: true,
            onBefore: cs_serialScrollFixLock,
            duration: 300,
            step: 1,
            lazy: true,
            lock: false,
            force: false,
            cycle: false
        });
        $('#crossselling_list').trigger('goto', [cs_middle - 3]);
    }
});;









var responsiveflagMenu = false;

function menuChange(status) {
    if (status == 'enable') {
        $('#menu-wrap').removeClass('desktop').addClass('mobile').find('#menu-trigger').show();
        $(' #menu-custom').removeAttr('style');
        $('#menu-trigger i').removeClass('icon-minus-sign-alt').addClass('icon-plus-sign-alt');
        $('.mobile #menu-trigger').on('click touchstart', function () {
            var catUl = $(this).next('ul#menu-custom');
            var anotherFirst = $('.header-button').find('ul');
            var anotherSecond = $('#header').find('#cart_block');
            if (anotherFirst.is(':visible')) {
                anotherFirst.slideUp(), $('.header-button').find('.icon_wrapp').removeClass('active')
            }
            if (anotherSecond.is(':visible')) {
                anotherSecond.slideUp();
                $('#header_user').removeClass('close-cart')
            }
            if (catUl.is(':hidden')) {
                catUl.slideDown(), $(this).find('i').removeClass('icon-plus-sign-alt').addClass('icon-minus-sign-alt')
            } else {
                catUl.slideUp(), $(this).find('i').removeClass('icon-minus-sign-alt').addClass('icon-plus-sign-alt');
            }
            return false
        })
        $('#menu-wrap.mobile #menu-custom').on('click touchstart', function (e) {
            e.stopPropagation();
        });
        $('.main-mobile-menu ul ul').addClass('menu-mobile-2');
        $('#menu-custom ul ').addClass('menu-mobile-2');
        $('#menu-custom  li').has('.menu-mobile-2').prepend('<i class="open-mobile-2 icon-plus"></i>');
        $("#menu-custom   .open-mobile-2").on('click touchstart', function () {
            var catSubUl = $(this).next().next('.menu-mobile-2');
            if (catSubUl.is(':hidden')) {
                catSubUl.slideDown(), $(this).removeClass('icon-plus').addClass('icon-minus')
            } else {
                catSubUl.slideUp(), $(this).removeClass('icon-minus').addClass('icon-plus');
            }
            return false
        })
        $(document).on('click  touchstart', function () {
            $('.mobile #menu-trigger').find('i').removeClass('icon-minus-sign-alt').addClass('icon-plus-sign-alt'), $('.mobile #menu-trigger').next('ul#menu-custom').slideUp();
        })
        return false;
    } else {
        $('#menu-wrap').removeClass('mobile').addClass('desktop'), $('#menu-custom  li').has('.menu-mobile-2').children('i').remove(), $('#menu-custom  li .menu-mobile-2, #menu-custom').removeAttr('style');
        $("#menu-custom   .open-mobile-2").off();
        $('#menu-wrap').find('#menu-trigger').off().hide();
    }
}

function menuChangeDo() {
    container_width = $('body').find('.container').width();
    if (container_width <= 970 && responsiveflagMenu == false) {
        menuChange('enable');
        responsiveflagMenu = true;
    } else if (container_width > 970) {
        menuChange('disable');
        responsiveflagMenu = false;
    }
}
$(document).ready(menuChangeDo);
$(window).resize(menuChangeDo);;