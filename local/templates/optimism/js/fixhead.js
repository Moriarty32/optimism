 $(document).ready(function() {
     var hHeight = $(".header").height(),
        breakpointDiv = $('body').hasClass('body--index') ? $('#choice_by') : $('.full-panel.type-one.blue-grad.py-cus1').first(),
        breakpointF = breakpointDiv.length ? breakpointDiv.offset().top + breakpointDiv.innerHeight() - hHeight : $(window).height();
        

    if($('body').hasClass('body--index')) {
        breakpointF = breakpointF - 90;
    } else if($('body').hasClass('page_404')) {
        breakpointF = 999999999;
    };

    $(window).scroll(function() {
        var windowOffset = $(window).scrollTop();

        if (windowOffset >= breakpointF && $(window).width() > 767) {
            $('main.content').css('margin-top', hHeight);
            $("header.header").addClass('fixed-header')
        } else {
            $('main.content').css('margin-top', 0);
            $("header.header").removeClass('fixed-header')
        }
    });
});