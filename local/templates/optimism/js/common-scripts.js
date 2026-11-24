/*
window.onload = function() {
    if ((self.parent && !(self.parent === self)) && (self.parent.frames.length != 0)) {
        var xhr;
        var urlN = (window.location != window.parent.location) ? document.referrer : document.location.href;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest()
        } else if (window.ActiveXObject) {
            xhr = new ActiveXObject("Microsoft.XMLHTTP")
        };
        xhr.open('GET', '/ajax/ajax_iframelog.php' + '?url_check=' + urlN, !0);
        xhr.send()
    }
};
*/
$(document).ready(function(){$('.slider-one').slick({slidesToShow:1,slidesToScroll:1,adaptiveHeight:!1,arrows:!1,fade:!0,dots:!1,speed:0,draggable:!1,touchThreshold:100,asNavFor:'.slider-two',responsive:[{breakpoint:1200,settings:{dots:!1},breakpoint:991.98,settings:{dots:!1,fade:!1,speed:100,touchThreshold:15}}]});$('.slider-two').slick({slidesToShow:$('.slider-two').data('slides-to-show')?$('.slider-two').data('slides-to-show'):3,slidesToScroll:1,vertical:!0,useTransform:!1,asNavFor:'.slider-one',centerMode:$('.slider-two').data('slides-to-show')?!1:!0,centerPadding:!1,focusOnSelect:!0,speed:0,verticalSwiping:!0,touchThreshold:15,touchMove:!1});$('.slider-one').on('setPosition',function(){$(this).find('.slick-slide').height('auto');var slickTrack=$(this).find('.slick-track');var slickTrackHeight=$(slickTrack).height();$(this).find('.slick-slide').css('height',slickTrackHeight+'px')});$('.sec-rates__more-note, .sec-rates_show-more').on('click',function(){var thisHtml=$('.sec-rates__more-note').find('span').html(),dataMem=$('.sec-rates__more-note').data('memory');$('.sec-rates__more-note').data('memory',thisHtml).find('span').html(dataMem);$('.check-list__row_toggle').toggleClass('d-none');$('.sec-rates__more-note').find('img').toggleClass('rotated');$('.sec-rates_show-more').toggleClass('rotated');/*$('.sec-rates__fixed-head').removeClass('active').toggleClass('fixed')*/});$(window).scroll(function(){var table=$('.sec-rates__col-lt .check-list__rows'),fixHeader=$('.sec-rates__fixed-head'),windowOffset=$(window).scrollTop(),tableOffset=table.length?table.offset().top:0,tableHeight=$(table).height();if($(window).outerWidth()>1299&&fixHeader.hasClass('fixed')&&windowOffset>tableOffset-180&&windowOffset<tableOffset+tableHeight-155){fixHeader.addClass('active')}else{fixHeader.removeClass('active')}})})

function isGChrome() {
    var nu = navigator.userAgent;
    console.log(nu);
    if(nu.search(/Chrome/) > 0) {
        if(nu.search(/OPR/) > 0 || nu.search(/Edge/) > 0 || nu.search(/YaBrowser/) > 0) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

function videoIndex() {
    $('body').addClass('video-first');
    $('.header-navbar-brand-img').attr('src', '/local/templates/optimism/img/logo-wht.svg');
    
    var videosrc = $('[data-action=playvideo]').data('video'),
        videoBlock = '<div id="index-video"><div class="video_wrapper"><video muted="muted" preload="auto" autoplay="autoplay" loop="loop" webkit-playsinline=""><source src="'+ videosrc + '" type="video/mp4"></video></div></div>',
        turnBtn = '<span class="is-muted position-relative turn-sound-but"><span class="click-area position-absolute" data-action="turnSound"></span></span>';
    console.log(videosrc);
    $('.arrow-down-main').after(videoBlock);
    $('.body--index .panel-title .title span:first-child').addClass('position-relative').append(turnBtn)
};

function turnSound() {
    var t = $('video');
    if (t.length) {
        if (t.prop('muted') == !1) {
            t.prop('muted', !0)
        } else {
            t.prop('muted', !1)
        }
    };
    $(this).parent().toggleClass('is-muted')
};

function reinitSlick(type = 'main') {
    if ($('.slider-one[data-nav-for]').length && $('.slider-two[data-nav-for]').length) {
        $('.slider-one').not('.slick-initialized').each(function(index) {
            var $asNavForOne = $(this).data('nav-for'),
                $sliderOne = $(this).data('slider');
            $($sliderOne).slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                adaptiveHeight: !1,
                arrows: !1,
                dots: !1,
                speed: 0,
                touchThreshold: 100,
                draggable: !1,
                asNavFor: $asNavForOne,
                responsive: [{
                    breakpoint: 1200,
                    settings: {
                        dots: !1
                    },
                    breakpoint: 991.98,
                    settings: {
                        speed: 100,
                        fade: !1,
                        dots: !1,
                        touchThreshold: 15
                    }
                }],
            });
            var dots = $(this).find('.slick-dots li');
            if (dots.length > 10) {
                dots.hide();
                dots.eq(0).show().next().show().next().show().next().show().next().show().next().show().next().show().next().show().next().show()
            };
            $(this).on('beforeChange', function(event, slick, currentSlide, nextSlide) {
            	$active = $(this).find(".slick-slide").eq(currentSlide);
            	$next = $(this).find(".slick-slide").eq(nextSlide + 1);
            	
				if (type == 'main'){
					if ($next.find('.slider-img-wrapper').data('src') != "" && 'url("' + $next.find('.slider-img-wrapper').data('src') + '")' != $next.find('.slider-img-wrapper').css('background-image')) {
						$next.find('.slider-img-wrapper').css('background-image', 'url("' + $next.find('.slider-img-wrapper').data('src') + '")')
					}
				}	

                if (dots.length > 10) {
					// 11/01/23 fixed
					console.log("dots.length=" + dots.length);
					console.log("nextslide= " + nextSlide);
                    //dots.hide();
					if(nextSlide >=8){
						/**при движении зазад**/
						if(dots.length - nextSlide - 1 == 0){
							dots.hide();
							dots.eq(nextSlide).show().prev().show().prev().show().prev().show().prev().show().prev().show().prev().show().prev().show().prev().show()
						}
						else{
							/*при движении вперед все ок*/
							dots.eq(nextSlide-8).hide('slow');
							
							dots.eq(nextSlide+10).hide('slow'); // fixed
							
							dots.eq(nextSlide).next().show('slow');
							dots.eq(nextSlide).show('slow');
						}
					}
					else{
						if (nextSlide == 0) {
							dots.hide();
							dots.eq(nextSlide).show().next().show().next().show().next().show().next().show().next().show().next().show().next().show().next().show()
						}	
						else if(dots.eq(nextSlide).prev().css('display') == 'none'){
							dots.eq(nextSlide + 8).hide('slow');
							dots.eq(nextSlide).prev().show('slow');
						}
					}
					
					
                   /* dots.hide();
                    if (nextSlide == 0) {
                        dots.eq(nextSlide).show().next().show().next().show().next().show().next().show().next().show().next().show().next().show().next().show()
                    } else if (nextSlide == 1) {
                        dots.eq(nextSlide).show().next().show().next().show().next().show().next().show().next().show().next().show().next().show();
                        dots.eq(nextSlide).prev().show()
                    } else if (nextSlide == 2) {
                        dots.eq(nextSlide).show().next().show().next().show().next().show().next().show().next().show().next().show();
                        dots.eq(nextSlide).prev().show().prev().show()
                    } else if (nextSlide == 3) {
                        dots.eq(nextSlide).show().next().show().next().show().next().show().next().show().next().show();
                        dots.eq(nextSlide).prev().show().prev().show().prev().show()
                    } else if (dots.length - nextSlide - 1 == 3) {
                        dots.eq(nextSlide).show().prev().show().prev().show().prev().show().prev().show().prev().show();
                        dots.eq(nextSlide).next().show().next().show().next().show()
                    } else if (dots.length - nextSlide - 1 == 2) {
                        dots.eq(nextSlide).show().prev().show().prev().show().prev().show().prev().show().prev().show().prev().show();
                        dots.eq(nextSlide).next().show().next().show()
                    } else if (dots.length - nextSlide - 1 == 1) {
                        dots.eq(nextSlide).show().prev().show().prev().show().prev().show().prev().show().prev().show().prev().show().prev().show();
                        dots.eq(nextSlide).next().show()
                    } else if (dots.length - nextSlide - 1 == 0) {
                        dots.eq(nextSlide).show().prev().show().prev().show().prev().show().prev().show().prev().show().prev().show().prev().show().prev().show()
                    } else {
                        dots.eq(nextSlide).show().prev().show().prev().show().prev().show().prev().show();
                        dots.eq(nextSlide).next().show().next().show().next().show().next().show()
                    }*/
                }
            });
            $($sliderOne).on('setPosition', function() {
                $(this).find('.slick-slide').height('auto');
                var slickTrack = $(this).find('.slick-track');
                var slickTrackHeight = $(slickTrack).height() - 150;
                //$(this).find('.slick-slide').css('height', slickTrackHeight + 'px')  fixed 28/03/2023
            })
        });
        var prev_text = '',
            next_text = '';
        if ($('body').hasClass('body--index')) {
            prev_text = ' title="Предыдущий кейс по продвижению сайта"';
            next_text = ' title="Следующий кейс по продвижению сайта"'
        };
        $('.slider-two').not('.slick-initialized').each(function(index) {
            var $asNavForTwo = $(this).data('nav-for');
            var $sliderTwo = $(this).data('slider');
            $($sliderTwo).slick({
                slidesToShow: $($sliderTwo).data('slides-to-show') ? $($sliderTwo).data('slides-to-show') : 3,
                slidesToScroll: 1,
                vertical: !0,
                useTransform: !1,
                asNavFor: $asNavForTwo,
                centerMode: $($sliderTwo).data('slides-to-show') ? !1 : !0,
                centerPadding: !1,
                focusOnSelect: !0,
                speed: 0,
                verticalSwiping: !0,
                touchThreshold: 15,
                touchMove: !1,
                prevArrow: '<button class="slick-prev" aria-label="Previous" type="button"' + prev_text + '><span class="control-element"></span></button>',
                nextArrow: '<button class="slick-next" aria-label="Next" type="button"' + next_text + '><span class="control-element"></span></button>'
            })
        });
        $('.slider-two').slick('setPosition')
    }
};

function resizeQloud() {
    var qloudDiv = $('#technologyCloud'),
        qloudDivHeight = qloudDiv.height(),
        $width = $(window).width();
    var $transform = $width < 1700 ? $width / 1700 : 1;
    var $trans = $transform.toFixed(1);
    var $transCss = 'translateY(-' + qloudDivHeight * (1 - $trans) / 2 + 'px) scale(' + $trans + ')';
    qloudDiv.css('transform', $transCss);
    qloudDiv.parent().css('height', $trans * qloudDivHeight)
};

function resizeQloudCennocty() {
    var qloudDiv = $('#cennoctyCloud'),
        qloudDivHeight = qloudDiv.height(),
        $width = $(window).width();
    var $transform = $width < 1800 ? $width / 1800 : 1;
    var $trans = $transform.toFixed(1) - 0.025;
    var $transCss = 'translateY(-' + qloudDivHeight * (1 - $trans) / 2 + 'px) scale(' + $trans + ')';
    qloudDiv.css('transform', $transCss);
    qloudDiv.parent().css('height', $trans * qloudDivHeight)
};

function changeActiveLeftList(el, slider) {
    var sliderPar = $(slider).closest('.slider-second');
    if (sliderPar.length > 0) {
        sliderPar.find('.list-slider li a').removeClass('active');
        var activeSlide = el ? el : 0;
        sliderPar.find('.list-slider li[data-slide-to="' + activeSlide + '"] a').addClass('active')
    }
};

function changeActiveLeftListSeo(el, slider) {
    var sliderPar = $(slider).closest('.slider-second-seo');
    if (sliderPar.length > 0) {
        sliderPar.find('.list-slider li a').removeClass('active');
        var activeSlide = el ? el : 0;
        sliderPar.find('.list-slider li[data-slide-to="' + activeSlide + '"] a').addClass('active')
    }
};

function BSChange(direction, slider) {
    var sliderTargetId = 0,
        slideCount = $(slider).find('[data-bsslide-id]').length;
    if (direction == "prev" || direction == "right") {
        sliderTargetId = $(slider).find('.active[data-bsslide-id]').data('bsslide-id') == 1 ? slideCount : $(slider).find('.active[data-bsslide-id]').data('bsslide-id') - 1
    } else if (direction == "next" || direction == 'left') {
        sliderTargetId = $(slider).find('.active[data-bsslide-id]').data('bsslide-id') == slideCount ? 1 : $(slider).find('.active[data-bsslide-id]').data('bsslide-id') + 1
    } else {
        return !1
    };
    $(slider).find('[data-bsslide-id]').removeClass('active');
    $(slider).find('[data-bsslide-id=' + sliderTargetId + ']').addClass('active')
};

function todefault() {
    $("#SendButtonEs").removeAttr('disabled').removeAttr('style').removeClass('error-SendButtonEs').html('<i class="icon icon-arrow-right"></i>');
    $('#emailEs').val('').removeAttr('disabled').removeAttr('style').removeClass('error-emailEs')
};

function mainMenuAtDroppedHeight() {
    if ($(window).width() < 576) {
        $('.dropped-menu-main').css('min-height', $('.header-drop-body-wrapper').height())
    } else {
        $('.dropped-menu-main').removeAttr('style')
    }
};
$(document).ready(function() {
    if(!isGChrome() && $('.onlyChrome').length) {
        $('.onlyChrome').removeClass('d-none');
        $('.onlyChrome').data('video', '/local/templates/optimism/video/mainvideo/24/ver3.mp4');
        // $('.onlyChrome').remove();
    } else {
        $('.onlyChrome').removeClass('d-none');
        $('.onlyChrome').data('video', '/local/templates/optimism/video/optimism_youtube_1920x1080_bezpolos_beznadpisey.mp4');
        // $('.onlyChrome').removeClass('d-none');
    }
    $(document).on('click', '.js-service__drop', function() {
        if($(window).outerWidth() < 576) {
            $(".header-drop-body-wrapper").animate({
                scrollTop: $('.js-service__dropstart').offset().top - 45 + "px"
            });
        }
    });

    $(document).on('click', '.js-service__footer', function() {
        if($(window).outerWidth() < 576) {
            $("html, body").animate({
                scrollTop: $('.js-service__footerstart').offset().top + "px"
            });
        }
    });
    $('.team-section').click(function() {
        $(this).addClass('hide-after')
    });
    $('.all-element:not(.show-hidden-logo) a:not(#show-all-clients)').click(function() {
        $(this).closest('.row').remove()
    });
    $('.moreservices-block .carousel-indicators').click(function(e) {
        e.preventDefault();
        $target = $(e.target);
        if (!$target.data('target')) {
            $('.moreservices-block #carousel1').carousel('next')
        }
    });
    $(document).on('click', '[data-action=playvideo]', videoIndex);
    $(document).on('click', '[data-action="turnSound"]', turnSound);
    $('[data-action=link]').on('click', function() {
        window.location = $(this).data('href')
    });
    $('[data-action=reloadPage]').on('click', function() {
        location.reload()
    });
    if ($(".js-inner-slider").length > 0) {
		$(".js-inner-slider").each(function(k, el) {
			var $slider = $(el),
				slides = $slider.find(".content-inner-slider").children(".inner-slider-item"),
				i = slides.length;
		
			// Навигация точками (если не создана)
			if ($slider.find(".carousel-navigation-wrapper").length === 0) {
				$slider.find(".carousel-navigation").append('<div class="carousel-navigation-wrapper d-inline-block"></div>');
				for (var j = 0; j < slides.length; j++) {
					$slider.find(".carousel-navigation .carousel-navigation-wrapper").append(
						"<div data-to-slide='#" + $slider.attr('id') + "' data-nav='" + j + "' class='dot" + (j == 0 ? " active" : "") + "'></div>"
					);
				}
			}
		
			// Функция управления стрелками
			function updateArrows() {
				var dots = $slider.find('.dot');
				var current = dots.filter('.active').index();
				$slider.find('.slide-arrow.prev').toggle(current > 0);
				$slider.find('.slide-arrow.next').toggle(current < dots.length - 1);
			}
		
			// Обработчик клика по точке
			$slider.on('click', '.dot', function() {
				var to = $(this).data('nav');
				$slider.find('.carousel-navigation .active').removeClass('active');
				$slider.find('.content-inner-slider .active').removeClass('active');
				$(this).addClass('active');
				$slider.find('.content-inner-slider').find("div.inner-slider-item[data-isSlide-id='" + to + "']").addClass('active');
				updateArrows();
			});
		
			// Клик по стрелке влево
			$slider.on('click', '.slide-arrow.prev', function() {
				$slider.find('.dot.active').prev('.dot').trigger('click');
			});
		
			// Клик по стрелке вправо
			$slider.on('click', '.slide-arrow.next', function() {
				$slider.find('.dot.active').next('.dot').trigger('click');
			});
		
			// Свайпы (если библиотека TouchSwipe подключена)
			if ($.fn.swipe) {
				$slider.swipe({
					swipeLeft: function() { $slider.find('.slide-arrow.next').click(); },
					swipeRight: function() { $slider.find('.slide-arrow.prev').click(); },
					allowPageScroll: "vertical"
				});
			}
		
			// Инициализация стрелок
			updateArrows();
		});
    };

    $(document).on('click', '.slider-second-seo .carousel-controls .carousel-control-prev', function(e) {
        e.preventDefault();
        $(this).closest('.slider-second-seo').find('#carousel3 .carousel-item.active .slide-arrow.prev').first().trigger('click');
    });

    $(document).on('click', '.slider-second-seo .carousel-controls .carousel-control-next', function(e) {
        e.preventDefault();
        $(this).closest('.slider-second-seo').find('#carousel3 .carousel-item.active .slide-arrow.next').first().trigger('click');
    });

    if ($("#two-inner-slider").length > 0) {
        var sliders = $("#two-inner-slider .content-inner-slider").children(".inner-slider-item");
        var i = sliders.length;
        for (j = 0; j < sliders.length; j++) {
            if (j == 0) {
                $("#two-inner-slider .carousel-navigation").append("<div data-to-slide='#two-inner-slider' data-nav='" + j + "' class='dot active'></div>")
            } else {
                $("#two-inner-slider .carousel-navigation").append("<div data-to-slide='#two-inner-slider' data-nav='" + j + "' class='dot'></div>")
            }
        }
    };
    $('.about-photo-slider img').click(function() {
        if ($(window).width() > 991) {
            $(this).closest('.carousel').carousel('next')
        }
    });
    $('#two-inner-slider .carousel-navigation .dot').click(function() {
        var to = $(this).data('nav');
        $('#two-inner-slider .carousel-navigation .active').removeClass('active');
        $('#two-inner-slider .content-inner-slider .active').removeClass('active');
        $(this).addClass('active');
        $('#two-inner-slider .content-inner-slider').find("div.inner-slider-item[data-isSlide-id='" + to + "']").addClass('active');
        var background = $('#two-inner-slider .content-inner-slider').find("div.inner-slider-item[data-isSlide-id='" + to + "']").data('background');
        $('.too-slider .slide-second').css("background-image", "url(" + background + ")")
    });
    $('[data-bsslider]').click(function() {
        var direction = $(this).data('bsslider-dir');
        BSChange(direction, $($(this).data('bsslider')))
    });
    if ($('.reasons-slider').length > 0) {
        $('.reasons-slider').swipe({
            swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
                BSChange(direction, $(this))
            },
            allowPageScroll: "vertical"
        })
    };
    $('.reasons-slider-switcher .text-big:not([data-bsslider])').on('click', function() {
        if ($(this).parent().hasClass('text-left') && $(this).hasClass('type-two')) {
            BSChange('prev', $('.reasons-slider'))
        } else {
            BSChange('next', $('.reasons-slider'))
        }
    });
    $('#carousel1').on('slide.bs.carousel', function(e) {
        changeActiveLeftList($(e.relatedTarget).data('slideid'), '#carousel1')
    });
    $('#carousel2').on('slide.bs.carousel', function(e) {
        changeActiveLeftList($(e.relatedTarget).data('slideid'), '#carousel2')
    });
    $('#carousel3').on('slide.bs.carousel', function(e) {
        changeActiveLeftListSeo($(e.relatedTarget).data('slideid'), '#carousel3')
    });
    $('#carousel-three').on('slide.bs.carousel', function(e) {
        changeActiveLeftList($(e.relatedTarget).data('slideid'), '#carousel-three');
        $('#our-power h2').html('Наша сила <br>' + $('#our-power a.active span').text().toLowerCase())
    });
    $('.about-photo-slider #carousel2').on('slide.bs.carousel', function(e) {
        var $active = $(e.relatedTarget),
            $next = $active.next(),
            $prev = $active.prev();
        if ($active.find('img').prop('src') != $active.find('img').data('src')) {
            $active.find('img').prop('src', $active.find('img').data('src')).parent()
        };
        if ($prev.find('img').prop('src') != $prev.find('img').data('src')) {
            $prev.find('img').prop('src', $prev.find('img').data('src')).parent()
        };
        if ($next.find('img').prop('src') != $next.find('img').data('src')) {
            $next.find('img').prop('src', $next.find('img').data('src')).parent()
        }
    });
    $('#carousel9').on('slide.bs.carousel', function(e) {
        changeActiveLeftList($(e.relatedTarget).data('slideid'), '#carousel9')
    });
    if ($('#carousel1').length) {
        $('#carousel1').carousel({
            interval: !1
        })
    };
    if ($('#carousel_bottom').length) {
        $('#carousel_bottom').carousel({
            interval: !1
        }).on('slide.bs.carousel', function(e) {
            changeActiveLeftList($(e.relatedTarget).data('slideid'), '#carousel_bottom')
        });
        changeActiveLeftList(0, '#carousel_bottom')
    };
    if ($('#carousel2').length) {
        $('#carousel2').carousel({
            interval: !1
        })
    };
    if ($('#carousel3').length) {
        $('#carousel3').carousel({
            interval: !1
        })
    };
    if ($('#carousel9').length) {
        $('#carousel9').carousel({
            interval: !1
        })
    };
    if ($('#carousel-three').length) {
        $('#carousel-three').carousel({
            interval: !1
        })
    };
    changeActiveLeftList(0, '#carousel1');
    changeActiveLeftList(0, '#carousel2');
    $('.navbar-toggle .menu-toggle, [data-action=toggle-menu]').on('click', function() {
        $('#header_drop_block').toggle();
        $('body').toggleClass('overflowed');
        mainMenuAtDroppedHeight()
    });
    $('.navbar-toggler .menu-toggle').on('click', function() {
        $(this).toggleClass('active');
        $($(this).parent().data('target')).toggle()
    });
    $(document).keydown(function(eventObject) {
        if (eventObject.which == 27) {
            $('#header_drop_block').hide();
            $('body').removeClass('overflowed')
        }
    });
    $('.slideit').click(function(e) {
        e.preventDefault();
        var par = $(this).find('.slideit-list'),
            active = par.find('.active'),
            next = active.next();
        if (!next.length) {
            next = $('.slideit-list span').first()
        };
        active.removeClass('active');
        next.addClass('active')
    });
    $(".yak_link").click(function() {
        var _href = $(this).attr("href");
		if($(_href).length != 0)
			$("html, body").animate({
				scrollTop: $(_href).offset().top - 45 + "px"
			});
        return !1
    });
    $("#SendButtonEs").click(function(event) {
        event.preventDefault();
        $("#SendButtonEs").attr('disabled', 'disabled');
        $("#emailEs").attr('disabled', 'disabled');
        sendForm(document.subscribe_es.emailEs.value);
        setTimeout(function() {
            todefault()
        }, 3000)
    });
    $("form[name=subscribe_es]").keydown(function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            $("#SendButtonEs").attr('disabled', 'disabled');
            $("#emailEs").attr('disabled', 'disabled');
            sendForm(document.subscribe_es.emailEs.value);
            setTimeout(function() {
                todefault()
            }, 3000)
        }
    });

    function sendForm(Email) {
        $('#emailEs').attr('disabled', 'disabled');
        $('#SendButtonEs').attr('disabled', 'disabled');
        var address = "/es/es2.php";
        $.ajax({
            type: "POST",
            url: address,
            data: ({
                Email: Email
            }),
            success: function(data) {
                data = data.split(',');
                if (data[0] == 'success') {
                    $('#emailEs').val(data[1]).css('border-color', 'rgb(102, 204, 0)');
                    $("#SendButtonEs").css('background', 'rgb(102, 204, 0)').css('border-color', 'rgb(102, 204, 0)').html('Ок');
                    dataLayer.push({
                        'event': 'GAEvent',
                        'eventCategory': 'subscribe',
                        'eventAction': 'send'
                    })
                } else {
                    $('#emailEs').val(data[1]).addClass('error-emailEs');
                    $("#SendButtonEs").addClass('error-SendButtonEs')
                };
                $("#EmailEs").css('color', 'black')
            }
        })
    };
	
	
	if($('.lazy-index').length>0){
	   setTimeout(function(){   
		  $('.lazy-index').each(function(i,el){
			 var src = $(el).data("src");
			 if(typeof(src) != undefined){
				$(el).attr('src',src);
			 }
		  });
		reinitSlick();  
	   },2500);
	}
	
    reinitSlick();
    if ($('#technologyCloud').length) resizeQloud();
    if ($('#cennoctyCloud').length) resizeQloudCennocty()
});
var r = $("video");
$(window).on('load', function() {
    $('[data-preload=style]').removeAttr('style').removeAttr('data-preload');
    resizeQloud();
    if ($('#cennoctyCloud').length) resizeQloudCennocty();
    if (r.length) {
        $(this).click();
        var s = r[0];
        s.play();
        r.addClass("is-active");
        $(this).click()
    };
    mainMenuAtDroppedHeight();
	/*
    if ($('.team-section').length) {
        if ($(window).outerWidth() > 575) {
            $(document).on('teamajaxinit', function() {
                $(document).off('teamajaxinit');
                $(document).off('scroll.ajax');
                $.ajax({
                    type: "POST",
                    url: '/ajax/ajax_team.php',
                    success: function(data) {
                        $('.team-section img').get(0).outerHTML = data
                    }
                })
            })
        }
    };*/
	
	/*$(document).on('indexcaseajaxinit', function() {
		$(document).off('indexcaseajaxinit');
		$(document).off('scroll.ajax');
		$.ajax({
			type: "POST",
			url: '/ajax/ajax_main_case.php',
			success: function(data) {
				$('section.slider-section.main-page.order-5').get(0).outerHTML = data;
				reinitSlick();
			}
		})
	})*/
	
	
    if ($('.show-hidden-logo').length) {
        $('.show-hidden-logo').click(function() {
            $('.our-clients-box').removeClass('hide-on');
            $(this).closest('.row').remove()
        })
    };
    if ($('[data-lazy]').length) {
        $('[data-lazy]').each(function(i, el) {
            $(el).css('background-image', 'url(' + $(el).data('lazy') + ')')
        })
    }
	
	if($('.lazy-clients').length>0){ 
		  $('.lazy-clients').each(function(i,el){
			 var src = $(el).data("src");
			 if(typeof(src) != undefined){
				$(el).attr('src',src);
			 }
		  });
	}
	
	
	
	
	
});
$(window).on('resize', function() {
    if ($('#technologyCloud').length) resizeQloud();
    if ($('#cennoctyCloud').length) resizeQloudCennocty();
    if ($(window).outerWidth() < 991) {
        if ($('.mainpage-carousel #carousel1').find('.carousel-item.active').data('slideid') != 0) {
            $('.mainpage-carousel #carousel1').carousel(0);
            changeActiveLeftList(0, '.mainpage-carousel #carousel1')
        }
    }
});
$(window).on('scroll.ajax', function() {
    $(document).trigger('teamajaxinit');
	$(document).trigger('indexcaseajaxinit');
});
$.fn.tabsInit = function(tabsBody) {
    var $tabsHead = $(this),
        $buttons = $tabsHead.find(".js-tabs-btn"),
        $tabsBody, $tabs;
    if (tabsBody) {
        $tabsBody = $(tabsBody)
    } else {
        $tabsBody = $tabsHead.siblings(".js-tabs-body")
    };
    $tabs = $tabsBody.find(".js-tabs-item");
    $buttons.click(function() {
        var tabId = "#" + $(this).data("tab");
        $buttons.removeClass("is-active");
        $(this).addClass("is-active");
        $tabs.removeClass("is-active");
        $(tabId).addClass("is-active")
    });
    return this
};
$("#offer-tabs").tabsInit();


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

function resizeCarouselQloud2() {
  var seoDiv = $('#technologyCloudCarousel2 #seo-optimization2');
  var www = $(window).width() * 0.59999 + 20;
  var www2 = www / (www + www * 0.001);
  var $transform = window.matchMedia('(min-width: 1920px)').matches ? 0.85 : www / seoDiv.width() * www2;
  var $transCss = 'scale(' + $transform + ')';
  $('#technologyCloudCarousel2').css('transform', $transCss);
}

;

if ($('#technologyCloudCarousel2').length) {
  resizeCarouselQloud2();
  $(window).on('resize', resizeCarouselQloud2);
}


if($('.lazy-team').length>0){ 
	var fired_team = false;
	window.addEventListener('scroll', () => {
		if (fired_team === false) {
			fired_team = true;	
		   setTimeout(function(){   
			     var src = $('.lazy-team').data("src");
				$('.lazy-team').attr('src',src);
		   },500);
		}			   
	});
}

$(document).ready(function() {
    if ($(".js-inner-slider-new").length > 0) {
		$(".js-inner-slider-new").each(function(k, el) {
			var $slider = $(el),
				slides = $slider.find(".carousel-item"),
				i = slides.length;
		
			// Создаем навигацию
			$slider.find(".carousel-navigation").append('<div class="carousel-navigation-wrapper d-inline-block"></div>');
			for (var j = 0; j < slides.length; j++) {
				if (j == 0) {
					$slider.find(".carousel-navigation .carousel-navigation-wrapper").append(
						"<div data-to-slide='#inner-slider' data-nav='" + j + "' class='dot active'></div>"
					);
				} else {
					$slider.find(".carousel-navigation .carousel-navigation-wrapper").append(
						"<div data-to-slide='#inner-slider' data-nav='" + j + "' class='dot'></div>"
					);
				}
			}
		
			// Функция управления стрелками
			function updateArrows() {
				var dots = $slider.find('.dot');
				var current = dots.filter('.active').index();
				$slider.find('.slide-arrow.prev').toggle(current > 0);
				$slider.find('.slide-arrow.next').toggle(current < dots.length - 1);
			}
		
			// Обработчик клика по точке
			$slider.on('click', '.dot', function() {
				var to = $(this).data('nav');
				$slider.find('.carousel-navigation .active').removeClass('active');
				$slider.find('.carousel-item.active').removeClass('active');
				$(this).addClass('active');
				$slider.find('.carousel-item[data-slideid="' + to + '"]').addClass('active');
				updateArrows();
			});
		
			// Обработчик клика по стрелке влево
			$slider.on('click', '.slide-arrow.prev', function() {
				$slider.find('.dot.active').prev('.dot').trigger('click');
			});
		
			// Обработчик клика по стрелке вправо
		$slider.on('click', '.slide-arrow.next', function() {
			$slider.find('.dot.active').next('.dot').trigger('click');
		});

		// Свайпы (если библиотека подключена)
			if ($.fn.swipe) {
				$slider.swipe({
					swipeLeft: function() { $slider.find('.slide-arrow.next').click(); },
					swipeRight: function() { $slider.find('.slide-arrow.prev').click(); },
					allowPageScroll: "vertical"
				});
			}
		
			// После инициализации
			updateArrows();
		});
    }
});

/*// Переключение стрелок для carousel3 в блоке part-right
$(document).ready(function() {
    var $seoSection = $('.slider-second-seo');
    
    // Обработчик для стрелки "prev"
    $seoSection.find('.carousel-control-prev').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        var $activeCarousel = $('#carousel3 .carousel-item.active');
        var $innerSlider = $activeCarousel.find('.js-inner-slider');
        var $activeDot = $innerSlider.find('.carousel-navigation .dot.active');
        var $prevDot = $activeDot.prev('.dot');
        
        // Если есть предыдущий dot, кликаем по нему, иначе по последнему
        if ($prevDot.length > 0) {
            $prevDot.trigger('click');
        } else {
            $innerSlider.find('.carousel-navigation .dot').last().trigger('click');
        }
        
        return false;
    });
    
    // Обработчик для стрелки "next"
    $seoSection.find('.carousel-control-next').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        var $activeCarousel = $('#carousel3 .carousel-item.active');
        var $innerSlider = $activeCarousel.find('.js-inner-slider');
        var $activeDot = $innerSlider.find('.carousel-navigation .dot.active');
        var $nextDot = $activeDot.next('.dot');
        
        // Если есть следующий dot, кликаем по нему, иначе по первому
        if ($nextDot.length > 0) {
            $nextDot.trigger('click');
        } else {
            $innerSlider.find('.carousel-navigation .dot').first().trigger('click');
        }
        
        return false;
    });
});*/
