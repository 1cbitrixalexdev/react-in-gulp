$(function () {
    $('[data-toggle="tooltip"]').tooltip()

    $('.toast').toast()
});

$(document).ready(function () {
    $('a[href^="#"]').not('[href="#carouselExampleIndicators"], [href="#collapsedItems"], [href="#close"]').click(function () {
        let target = $(this.hash);
        if (target.length === 0) target = $('a[name="' + this.hash.substr(1) + '"]');
        if (target.length === 0) target = $('html');
        let menuHeight = $('#full-menu').height() - 5;
        let ofs = ( $('#full-menu').css('position') === 'fixed' ) ? menuHeight : menuHeight * 2;
        $('html, body').animate({scrollTop: target.offset().top - ofs}, 800);
        return false;
    });

    $(function () {
       let v = $(window).width();
       if ( v >= 1024 ) {
           new WOW().init();
       }
    });

    $("head").append("<link rel='stylesheet' type='text/css' href='css/main.css' />");
});

$(window).on('load', function () {
    $(".se-pre-con").fadeOut("slow");
});

