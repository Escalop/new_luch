$(window).on("keydown", function (evt) {
  if (evt.keyCode === 27) {
    $(".jsOverlay").hide();
    $(".jsFeedback").hide();
    $(".jsSubscribe").hide();
    $(".jsCustomDesign").hide();
    $(".jsBrandMore").hide();
    $(".jsNoteMore").hide();
    $(".jsForm").hide();
  }
})

$(document).ready(function () {

  // Меню

  $(".jsMenuOpen").on("click", function () {
    if ($(".jsMenuOpen").hasClass("menu-close")) {
      $(".jsMenu").hide();
      $(".jsMenuOpen").removeClass("menu-close");
    } else {
      $(".jsMenu").show();
      $(".jsMenuOpen").addClass("menu-close");
    }
  })

  // Поиск

  $(".jsSearchOpen").click(function () {
    $(".jsSearch").toggleClass("display-none");
  });

  // Мобильное меню

  $(".jsMobileOpen").on("click", function () {
    if ($(".jsMobileOpen").hasClass("menu-close")) {
      $(".jsMenu").hide();
      $(".jsHeader").hide();
      $(".jsSearchMobile").show();
      $(".jsMobileOpen").removeClass("menu-close");
    } else {
      $(".jsMenu").show();
      $(".jsHeader").show();
      $(".jsSearchMobile").hide();
      $(".jsMobileOpen").addClass("menu-close");
    }
  })

  // Поиск в мобильном меню

  $(".jsSearchMobileIcon").on("click", function () {
    if ($(".jsSearchMobile").hasClass("main-header__mobile-search--open")) {
      $(".jsMobileLogo").show();
      $(".jsSearchInput").hide();
      $(".jsSearchMobile").removeClass("main-header__mobile-search--open");
    } else {
      $(".jsMobileLogo").hide();
      $(".jsSearchInput").show();
      $(".jsSearchMobile").addClass("main-header__mobile-search--open");
    }
  })

  // Слайдеры

  // Слайдер карточка товара

  $(".slider-for").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    fade: true,
    asNavFor: ".slider-nav"
  });
  $(".slider-nav").slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite: false,
    arrows: true,
    asNavFor: ".slider-for",
    dots: false,
    focusOnSelect: true
  });

  //Слайдер главной страницы

  $(".jsMainSlider").slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    arrows: true,
    adaptiveHeight: true,
    autoplay: 5000
  });

  // Слайдер Бренды

  $(".jsSliderBrand").slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    adaptiveHeight: true,
    arrows: true
  });

  $(".jsSliderInstruction").slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    arrows: false
  });

  $(".jsSliderPhilosophy").slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    arrows: false,
    autoplay: 5000
  });
  $(".jsPhotoNext").click(function () {
    $(".jsSliderPhilosophy").slick("slickNext");
  });

  $(".jsPhotoPrev").click(function () {
    $(".jsSliderPhilosophy").slick("slickPrev");

  });

  $(".jsSliderNewItem").slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    arrows: false
  });

  // История

  $(".single-item").slick({
    dots: false,
    initialSlide: $(".history-slider__control").length - 1,
    arrows: false,
    infinite: false,
    draggable: false
  });

  $(".single-item-content").slick({
    dots: false,
    initialSlide: $(".history-slider__control").length - 1,
    arrows: false,
    infinite: false,
    draggable: false
  });

  $(".single-item-content").on("beforeChange", function (event, slick, currentSlide, nextSlide) {
    $(".history-slider__control:eq(" + nextSlide + ")").prop("checked", true);
  });

  $(".single-item").on("beforeChange", function (event, slick, currentSlide, nextSlide) {
    $(".history-slider__control:eq(" + nextSlide + ")").prop("checked", true);
  });

  $(".history-slider__control").on("change", function () {
    var index = $(".history-slider__control").index($(this));
    $(".single-item").slick("slickGoTo", index);
    $(".single-item-content").slick("slickGoTo", index);
  });

  $(".jsHistoryNext").click(function () {
    $(".single-item").slick("slickNext");
    $(".single-item-content").slick("slickNext");
  });

  $(".jsHistoryPrev").click(function () {
    $(".single-item").slick("slickPrev");
    $(".single-item-content").slick("slickPrev");
  });

  // Рассчет высоты фотографии в слайдере история

  $(function () {
    $(".about__picture").height($(".about__picture").width() / 2);
    $('.about__section .youtube').height($('.about__section .youtube').width() / 2);

    $(window).resize(function () {
      $(".about__picture").height($(".about__picture").width() / 2);
      $('.about__section .youtube').height($('.about__section .youtube').width() / 2);
    });
  });

  // Интерактивная карта

  $(".jsPartner").hover(
    function (e) {
      var positionElement = e.target.getBoundingClientRect();
      var width = positionElement.width;
      var height = positionElement.height;
      var board = document.getElementById("svg");
      var boardEl = board.getBoundingClientRect();
      var top = positionElement.top - boardEl.top + (height/2);
      var left = positionElement.left - boardEl.left + (width/2);
      var name = $(this).data("name");
      var divBlock = $('.jsInfoMap');
      divBlock.removeClass('visually-hidden');
      divBlock.text(name)
      divBlock.css({
        left: left + 'px',
        top: top + 'px'
      })
    });

// Модальные окна

// Обратная связь

  $(".jsFeedbackShow").click(function () {
    $(".jsOverlay").show();
    $(".jsFeedback").show();
  });

  $(".jsFeedbackClose").click(function () {
    $(".jsOverlay").hide();
    $(".jsFeedback").hide();
  });

// Подписка

  $(".jsSubscribeShow").click(function () {
    $(".jsOverlay").show();
    $(".jsSubscribe").show();
  });

  $(".jsSubscribeClose").click(function () {
    $(".jsOverlay").hide();
    $(".jsSubscribe").hide();
  });

// Индивидуальный заказ

  $(".jsCustomDesignShow").click(function () {
    $(".jsOverlay").show();
    $(".jsCustomDesign").show();
  });

  $(".jsCustomDesignClose").click(function () {
    $(".jsOverlay").hide();
    $(".jsCustomDesign").hide();
  });


// Заказ ленты

  $(".jsFormShow").click(function () {
    $(".jsOverlay").show();
    $(".jsForm").show();
    $('.perfect-scroll').addClass('height100');
  });

  $(".jsFormClose").click(function () {
    $(".jsOverlay").hide();
    $(".jsForm").hide();
    $('.perfect-scroll').removeClass('height100');
  });

  $(".jsOverlay").click(function () {
    $(".jsOverlay").hide();
    $(".jsForm").hide();
    $('.perfect-scroll').removeClass('height100');
    $(".jsCustomDesign").hide();
    $(".jsSubscribe").hide();
    $(".jsFeedback").hide();
  })

//Бренды Подробнее

//  id генерируй для модалки такой же, как data-modal на кнопке Подробнее

var openModal = function (target) {
  $(".jsOverlay").show();
  $('.perfect-scroll').addClass('height100');

  var idModal = $(target).data('modal')
  $("#" + idModal).show();

  $('body').css('overflow', 'hidden');
};

  $(".jsBrandMoreShow").click(function () {
    openModal(this);
  });
  
  $(".jsNoteMoreShow").click(function () {
    openModal(this);
  });



var closeModal = function (target) {
  $(".jsOverlay").hide();
  var modal = $('.modal');
  modal.each(function() {
    modal.hide();
  });
  
  $('.perfect-scroll').removeClass('height100');
  $('body').css('overflow', 'auto');
}

  $(".jsBrandMoreClose").click(function () {
    closeModal();
  });

  $(".jsNoteClose").click(function () {
    closeModal(this);
  });

  $(".jsOverlay").click(function () {
    closeModal(this);
  })


// Прокрутка наверх страницы

  var top_show = 150;
  var delay = 700;

  $(window).scroll(function () {
    if ($(this).scrollTop() > top_show) $(".jsTop").fadeIn();
    else $(".jsTop").fadeOut();
  });
  $(".jsTop").click(function () {
    $("body, html").animate({
      scrollTop: 0
    }, delay);
  });

// Открытие фильтра в каталоге
  $(".jsFilterOpen").click(function () {
    $(".jsFilterMain").toggleClass("display-flex");
  });

// Открытие меню в разделе о компании
  $(".jsAboutOpen").click(function () {
    $(".jsAboutMenu").toggleClass("display-flex");
  });


// Задержка перехода по ссылкам главной станицы до конца анимации

  $(".jsBox1").on("click", function (e) {
    e.preventDefault();

    var size = $(window).width(),
      url = $(this).attr("href"),
      delay = 2000;
    setTimeout(function () {
      location.href = url;
    }, delay);
  });

  //Видео
  var rel = '?&rel=0';
  var video = $('.youtube').find('iframe');
  var videoSrc = video.attr('src');
  video.attr('src', videoSrc+rel);

 // Подключение скроллбара

$(".perfect-scroll").perfectScrollbar(); 
});


