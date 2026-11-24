"use strict";

var $listToCarousel = $('.js-list-five-to-carousel');

function initListToCarousel() {
  if (window.matchMedia('(max-width: 1199px)').matches) {
    if (!$listToCarousel.hasClass('is-inited')) {
      $listToCarousel.addClass('is-inited').slick({
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        adaptiveHeight: true,
        centerPadding: '0px',
        prevArrow: '',
        nextArrow: ''
      });
    }
  } else {
    if ($listToCarousel.hasClass('is-inited')) {
      $listToCarousel.removeClass('is-inited').slick('unslick');
    }
  }
}

initListToCarousel();
$(window).on('resize', initListToCarousel);
var $technologyCloudCarouselWrapper = $(".technology-cloud-carousel-wrapper");

if ($technologyCloudCarouselWrapper.length) {
  scrollCloudToCenter();
  $(window).on('resize', scrollCloudToCenter);
}

function scrollCloudToCenter() {
  $technologyCloudCarouselWrapper.scrollLeft($technologyCloudCarouselWrapper.width() / 2);
}

$('.list-slider').on('click', function () {
  if ($technologyCloudCarouselWrapper.length) {
    setTimeout(scrollCloudToCenter, 10);
  }
});
var $actionsSlider = $('.js-actions-slider');

if ($actionsSlider.length) {
  $actionsSlider.slick({
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    dots: true,
    appendDots: $('.js-actions-slider-dots'),
    appendArrows: $('.js-actions-slider-controls'),
    prevArrow: '<i class="actions-section__slider-control actions-section__slider-control--prev"></i>',
    nextArrow: '<i class="actions-section__slider-control actions-section__slider-control--next"></i>',
    responsive: [{
      breakpoint: 1366,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1
      }
    }, {
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1
      }
    }, {
      breakpoint: 740,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1
      }
    }]
  });
}

function adaptiveActionsHeight() {
  setTimeout(function () {
    var actionsHeight = 0;
    $('.actions-item').removeAttr('style').each(function () {
      if ($(this).height() >= actionsHeight) {
        actionsHeight = $(this).height();
      }
    }).height(actionsHeight);
  }, 300);
}

if ($('.actions-item').length) {
  adaptiveActionsHeight();
  $(window).on('resize', adaptiveActionsHeight);
}

$('.js-certificates-slider').slick({
  prevArrow: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" width="24px" height="40px" version="1.1" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" viewBox="0 0 24 40" stroke="#fff" stroke-width="1.5"><line x1="19.32" y1="2.75" x2="1.64" y2= "20.51" /><line x1="1.64" y1="20.51" x2="19.32" y2= "38.28" /></svg>',
  nextArrow: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" width="24px" height="40px" version="1.1" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" viewBox="0 0 24 40" stroke="#fff" stroke-width="1.5"><line x1="1.64" y1="2.75" x2="19.32" y2= "20.51" /><line x1="19.32" y1="20.51" x2="1.64" y2= "38.28" /></svg>'
});

function resizeCarouselQloud() {
  var seoDiv = $('#technologyCloudCarousel #seo-optimization');
  var www = $(window).width() * 0.66666 + 20;
  var www2 = www / (www + www * 0.001);
  var $transform = window.matchMedia('(min-width: 1920px)').matches ? 0.94 : www / seoDiv.width() * www2;
  var $transCss = 'scale(' + $transform + ')';
  $('#technologyCloudCarousel').css('transform', $transCss);
}

;

if ($('#technologyCloudCarousel').length) {
  resizeCarouselQloud();
  $(window).on('resize', resizeCarouselQloud);
}

/*$('.js-faq-item').on('click', function () {
  if ($(this).hasClass('is-active')) {
    $(this).removeClass('is-active');
  } else {
    $('.js-faq-item').removeClass('is-active');
    $(this).addClass('is-active');
  }
}); */

/*$('.js-faq-item').on('click', function () {
  $(this).toggleClass('is-active');
});*/

var $tarifSection = $('.js-tarifs-section');
var $tarifStructure = $('.js-tarifs-structure');
var $tarifTerm = $('.js-tarifs-term');
$tarifStructure.on('click', function () {
  $tarifSection.toggleClass('is-opened');
});
$tarifTerm.on('click', function () {
  if ($(this).hasClass('is-active')) {
    return;
  }

  $tarifTerm.removeClass('is-active');
  $(this).addClass('is-active');
  $tarifSection.toggleClass('is-term-opened');
});
var $tarifsSlider = $('.js-tarifs-slider');
var $tarifsSlide = $('.js-tarifs-slide');
var $tarifsDot = $('.js-tarifs-dot');

function initTarifsSlider() {
  if ($tarifsSlider.hasClass('is-inited')) {
    return;
  }

  $tarifsSlider.addClass('is-inited').slick({
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 1,
    centerMode: true,
    centerPadding: '0px',
    variableWidth: true,
    initialSlide: 1,
    prevArrow: '',
    nextArrow: ''
  });
  $tarifsDot.removeClass('is-active').eq(1).addClass('is-active');
}

function destroyTarifsSlider() {
  if (!$tarifsSlider.hasClass('is-inited')) {
    return;
  }

  $tarifsSlider.removeClass('is-inited').slick('unslick');
}

$tarifsDot.on('click', function (event) {
  event.preventDefault();
  var index = $(this).data('slide-index');
  $tarifsDot.removeClass('is-active');
  $(this).addClass('is-active');
  $tarifsSlider.slick('slickGoTo', index);
});
$tarifsSlider.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
  $tarifsDot.removeClass('is-active').eq(nextSlide).addClass('is-active');
});

function initTarifs() {
  if (window.matchMedia('(min-width: 1000px)').matches) {
    destroyTarifsSlider();
  } else {
    initTarifsSlider();
  }
}

initTarifs();
$(window).on('resize', initTarifs);