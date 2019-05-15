$(function () {
    var header = $(".header-transparent");
    $(window).scroll(function () {
        var scroll = $(window).scrollTop();

        if (scroll >= 200) {
            header.removeClass('header-transparent').addClass("header-solid");
        } else {
           header.removeClass("header-solid").addClass('header-transparent');
        }
    });
});
