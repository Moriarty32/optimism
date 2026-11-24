function checkVisible(elm) {
    var rect = elm.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return !(rect.bottom < 0 || rect.top - viewHeight >= 0);
}
$(function() {

    var $title = $('.body--index .panel-title .title');
    if ($title.length) {
        $title.find('span').css('white-space', '');
    }
    /* ��������� ������� ����� ������ � ������, ���� ������ ����� � ���� ���������*/
    var video = document.getElementById('offer__video'),
        wrap = document.getElementById('services'),
        wrapTwo = document.getElementById('sec-rates');
    if(video) {
        
        window.onscroll = function() {
            if(checkVisible(wrap)) {
                if (video.paused) video.play();
            } else { 
                if (!video.paused) video.pause();
            };
        };

        setTimeout(function() {
            video.remove()
        }, 60000)
       
    }
    /* /������ �������� ����� */
    $('.sec-offer__tabs-items').on('click', '.svg-link, .offer-tile__link, .offer-tile__topics li a, .sec-offer__more > a, .js-play-offer-bg a', function(e) {
        e.preventDefault();
        document.querySelector('#call-back-request').click()
    });
    $('.sec-plan').on('click', '.sec-plan__form-link a', function(e) {
        e.preventDefault();
        document.querySelector('#call-back-request').click()
    });
    $('#baloon-href').click(function() {
        window.open('https://optimism.ru/wow/','_blank')
    })
	// ������� �������� ��� ����� �������� ������
	if($('.lazy-rev').length>0){
	   setTimeout(function(){   
		  $('.lazy-rev').each(function(i,el){
			 var src = $(el).data("src");
			 if(typeof(src) != undefined){
				$(el).attr('src',src);
			 }
		  });
	   },1000);
	}
	
});
// ��������� ������ ������� ������ �� ��������, ����� ��� ��������� �������!
$(window).on('load', function() {
    if($(window).width() < 480) {
        var fixHeightMain = $('.body--index .panel-title').outerHeight();
        $('.body--index .panel-title').css('min-height', fixHeightMain);
    }
})


document.addEventListener('DOMContentLoaded', function () {

    const links = document.querySelectorAll('.js-download');
    const modal = document.getElementById('downloadModal');
    const manualLink = document.getElementById('manualDownload');
    const closeBtn = document.getElementById('closeModal');

    if (!modal) return;

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const fileUrl = this.href;

            startDownload(fileUrl);

            if (manualLink) {
                manualLink.href = fileUrl;
            }

            setTimeout(() => {
                openModal();
            }, 200);
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    function openModal() {
        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
    }

});

function startDownload(fileUrl) {

    try {
        const a = document.createElement('a');
        a.href = fileUrl;
        a.setAttribute('download', '');
        document.body.appendChild(a);
        a.click();
        a.remove();
    } catch (e) {
        window.open(fileUrl, '_blank');
    }

}