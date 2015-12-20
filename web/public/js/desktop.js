define([
  'skrollr',
  'app'
  ], function (skrollr, App) {
    'use strict';

    var Desktop = function() {
      this.init();
    };

    Desktop.prototype.init = function() {
      var videoTimeElapsed = 0;

      var homeGlobeBgImgUrls = [
        '/assets/images/homepage/masks/ee.jpg',
        '/assets/images/homepage/masks/mm.jpg',
        '/assets/images/homepage/masks/neesha.jpg',
        '/assets/images/homepage/masks/lian.jpg'
      ];

      $(document).ready(function(){

        // ------------------------------------------------------------
        // Global JS
        // ------------------------------------------------------------
        var windowHeight = $(window).height();
        var halfWindowHeight = windowHeight/2;

        if($(window).scrollTop() > 50){
          $(".fade-out-after-scroll").fadeOut(300);
        }

        if (isIE10) {
          $("html").addClass("ie10");
        }

        // START - thin font fix fo safari !
        var is_chrome = navigator.userAgent.indexOf('Chrome') > -1,
          is_safari = navigator.userAgent.indexOf("Safari") > -1,
          is_mac = (navigator.userAgent.indexOf('Mac OS') != -1),
          is_windows = !is_mac;

        if (is_chrome && is_safari){
          is_safari = false;
        }

        if (is_safari || is_windows){
          $("body").addClass("font-fix");
        }
        // END - thin font fix fo safari !

        // disable right click on video
        $("video").bind("contextmenu",function(){
          return false;
        });

        $(".abovefold-caret-down, .explore-more").click(function(){
          $(this).fadeOut(300);
          var body = $("html, body");
          body.animate({scrollTop:$(window).height() - 160}, '500', 'linear', function() {
          });
        });

        $('#menu-cta').on('click', function(e) {
          e.preventDefault();
          $(this).toggleClass('close');
          $('#menu').toggleClass('active');
        });

        // ------------------------------------------------------------
        // Homepage JS
        // ------------------------------------------------------------
        if($("#main.homepage").length){
          var scrollPercent = 0 ;
          var $mainVideo = $("#home-globe");

          //this is now hardcoded
          // App.newsBanner.init();

          $mainVideo[0].playbackRate = 0.6;

          skrollr.init({
            smoothScrolling: false,
            mobileDeceleration: 0.004,
            constants: {
              globe: function(){
                return $("#intro").height() - $(window).height() - 150;
              },
              storiestop: function(){
                return $("#stories-gallery").offset().top;
              }
            }
          });

          var randNumb = getRandomInt(0,homeGlobeBgImgUrls.length);

          $("#preload-img").hide()
          .one('load', function() {

            $(this).remove();

            $(".fb-loader-wrapper").fadeOut(600,function(){

              $("body").addClass("show-top-banner");

              if(window.location.hash==="#stories"){
                setTimeout(function(){
                  $("html,body").animate({ scrollTop: $(document).height()*2 },2200);
                },300);
              }
            });

            $("#intro .homepage-bg").css('background-image','url('+homeGlobeBgImgUrls[randNumb]+')');

          })
          .attr('src', homeGlobeBgImgUrls[randNumb])
          .each(function() {
            if(this.complete) $(this).trigger('load');
          });

        }

        // ------------------------------------------------------------
        // Story JS
        // ------------------------------------------------------------
        if($("#main.story1").length){
          var videoOutOfView = $('#tools').offset().top - $('.desktop-header').height();

          skrollr.init({
            smoothScrolling: false,
            mobileDeceleration: 0.004,
            constants: {
              legotop: function(){
                return $("#lego").offset().top - ( 0.4 * $(window).height() );
              },
              legobottom: function(){
                return $("#lego").offset().top - ( 0.2 * $(window).height() );
              },
              toolstop: function(){
                return $("#tools").offset().top - ( 0.5 * $(window).height() );
              },
              toolsbottom: function(){
                return $("#tools").offset().top - ( 0.2 * $(window).height() );
              },
              dancetop: function(){
                return $("#dance").offset().top - ( 0.2 * $(window).height() );
              },
              dancebottom: function(){
                return $("#dance").offset().top - ( 0.0 * $(window).height() );
              },
              progresstop: function(){
                return $("#progress").offset().top - ( 1 * $(window).height() );
              },
              progressbottom: function(){
                return $("#progress").offset().top + $("#progress").height();
              }
            }
          });

          setTimeout(function(){
            lazyLoadImages();
            lazyLoadVideos();
          },1000);

          if($("#page-wrapper.story3").length){
            var colorWindmillTop = $("#color-windmill").offset().top - 200;
            $(window).scroll(function() {
              if($(window).scrollTop() > colorWindmillTop) {
                $("#color-windmill").addClass('active');
              }
            });
            $("#white-windmill video")[0].playbackRate = 0.45;
          }

          $("#main-video-poster-preload").hide()
          .one('load', function() {
            $(".fb-loader-wrapper").fadeOut(600);
          })
          .attr('src', $("#main-video-poster-preload").attr('data-src'))
          .each(function() {
            if(this.complete) $(this).trigger('load');
          });

          $(".desk-video-cover")[0].addEventListener('playing', function() {
            $(".main-video-poster,.fb-loader-wrapper").fadeOut(400);
          }, false);

          var mainStoryVideo;
          if($("#story1_video").length){

            videojs("story1_video").ready(function(){
              mainStoryVideo = this;
              $(".btn-play-wrapper").click(function(e){
                $(".fade-out-after-scroll").fadeOut(300);
                $("#video-container .vjs-control-bar,#story1_video").fadeIn(300);
                mainStoryVideo.play();
                $("body").addClass('main-video-mode');
                $("#main .intro,#main .black-bg,.desk-video-cover ").fadeOut(600);
                fitMainVideo();
              });
            });

            videojs("story1_video").on("playing", function() {
              mainVideoDimensionFunction($("#video-container"));
            });

            videojs("story1_video").on("play", function() {
              if(!$("#story1_video").hasClass("no-fullscreen")){
                $(".btn-fullscreen-video").show();
              }
              $("#main .share-video").fadeOut(300);
              $("#video-container .vjs-control-bar").fadeIn(300);
            });

            videojs("story1_video").on("ended", function() {
            $(".btn-fullscreen-video").hide();
              $("#main .share-video").fadeIn(600);
              $("#video-container .vjs-control-bar").fadeOut(300);
              App.analytics.trackEvent("story-video", "video-watch", $("#story1_video").data("story") + "-ended");
            });

            videojs("story1_video").on("timeupdate", function() {
              var currentTime = parseInt(this.F.currentTime);

              if(currentTime !== 0 && currentTime % 5 == 0) {
                if(videoTimeElapsed !== currentTime) {
                  videoTimeElapsed = currentTime;
                  App.analytics.trackEvent('story-video', 'video-watch', $("#story1_video").data('story') + "-watch-" + currentTime + "-seconds");
                }
              }
            });
          }

          // ------------------------------------------------------------
          // Story Event Listeneres
          // ------------------------------------------------------------
          $(".vjs-control-bar").after($(".btn-fullscreen-video"));

          $(".btn-fullscreen-video").click(function(e){
            e.preventDefault();
            e.stopPropagation();
            $(".vjs-fullscreen-control").click();
          });

          $( window ).resize(function() {
            // make sure all videos cover their containers
            $('.fullscreen-video').each(function(i,video){
              dimensionFunction( $(video), $(video).parent());
            });
            mainVideoDimensionFunction($("#video-container"));
            videoOutOfView = $('#tools').offset().top - $('.desktop-header').height();
          });

          $(".back-to-stories").click(function(e){
            if($("body").hasClass('main-video-mode')){
              e.preventDefault();
              e.stopPropagation();
              $("body").removeClass('main-video-mode');
              $("#main .intro,.desk-video-cover ").fadeIn(300);
              $("#main .share-video").fadeOut(300);
              mainStoryVideo.pause();
              mainStoryVideo.currentTime(0);
            }
          });

          $(".btn-replay").click(function(e){
            e.preventDefault();
            e.stopPropagation();
            $("#video-container .vjs-control-bar").fadeIn(300);
            $("#main .share-video").fadeOut(300);
            mainVideoDimensionFunction($("#video-container"));
            mainStoryVideo.currentTime(0);
            mainStoryVideo.play();
          });

          // make sure all videos cover their containers
          $('.fullscreen-video').each(function(i,video){
            video.addEventListener('loadeddata', function() {
              dimensionFunction( $(video), $(video).parent());
            }, false);
            dimensionFunction( $(video), $(video).parent());
          });
        }

        // ------------------------------------------------------------
        // On Scroll
        // ------------------------------------------------------------
        var scrollTop;
        var $body = $("body");
        var $fadeOutAfterScroll = $(".fade-out-after-scroll");
        $(window).scroll(function() {

          scrollTop = $(window).scrollTop();

          if(scrollTop < 5) {
            $body.addClass('at-top');
          } else if(scrollTop > 200){
            $body.removeClass('at-top');
            $fadeOutAfterScroll.fadeOut(300);
          }

          if(scrollTop > halfWindowHeight){
            $body.addClass('page2');
          }

          $(".pause-off-view.skrollable-between.paused").each(function(i,obj){
            $(obj).removeClass('paused').addClass("playing");
            $(obj).find('video')[0].play();
          })

          $(".pause-off-view.skrollable-after.playing,.pause-off-view.skrollable-before.playing").each(function(i,obj){
            $(obj).addClass('paused').removeClass("playing");
            $(obj).find('video')[0].pause();
          })

          if(!$('.intro').is(":visible")) { //video is playing
            if(scrollTop > videoOutOfView) { //video out of view
              $body.removeClass('main-video-mode');
            } else {
              $body.addClass('main-video-mode');
            }
          }
        });
      });
    };
  return Desktop;
});


// ------------------------------------------------------------
// Functions
// ------------------------------------------------------------

function fitMainVideo(){
  $("#main").toggleClass('fullscreen-video-mode');
  mainVideoDimensionFunction($("#video-container"));
  if($("#main").hasClass('fullscreen-video-mode')){
    $('.fullscreen-video').width($(window).width());
  } else {
    $('.fullscreen-video').width('100%');
  }
}

function dimensionFunction($video, $container) {
  var videoAspectRatio = $video[0].videoHeight/$video[0].videoWidth;
  var videoContainerAspectRatio = $container.height()/$container.width()
  if (videoAspectRatio > videoContainerAspectRatio){
    $video.width($container.width());
    $video.height('auto');
  }
  else{
    $video.height($container.height());
    $video.width('auto');
  }
}

function lazyLoadImages(){
  $(".lazyload-img").each(function(i,obj){
    $(obj).css('background-image',$(obj).attr('data-background-image'));
  });
}

function lazyLoadVideos(){
  // $(".lazyload-video").each(function(i,obj){
    // $(obj)[0].play();
  // });
}

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function bannerRotateUpdates(){
  var $updates = $("#banner .update"),
      maxUpdates = $updates.length-1,
      currentUpdateIndex = 1;

      $updates.eq(currentUpdateIndex).show();

      if ( $updates.length > 2 ) {
          setInterval(function(){
            $("#updates-wrapper").fadeOut(300,function(){
              $updates.eq(currentUpdateIndex).hide();
              if(++currentUpdateIndex >  maxUpdates)
                currentUpdateIndex = 1;
              $updates.eq(currentUpdateIndex).show();
              $("#updates-wrapper").fadeIn(300);
              $("#banner").attr('href',$updates.eq(currentUpdateIndex).attr('data-href'));
            });
          }, 6000 );
    }
}

function mainVideoDimensionFunction($container){
  var videoAspectRatio = $("#story1_video_html5_api")[0].videoHeight / $("#story1_video_html5_api")[0].videoWidth;
  var videoContainerAspectRatio = $container.height()/$container.width()
  if (videoAspectRatio > videoContainerAspectRatio){
    $('#story1_video_html5_api').width($container.width()*1.08);
    $('#story1_video_html5_api').height('auto');
  }
  else{
    $('#story1_video_html5_api').height($container.height()*1.08);
    $('#story1_video_html5_api').width('auto');
  }
}

