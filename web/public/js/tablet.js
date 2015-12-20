define([
  'skrollr',
  'app',
  'jsmpg'
  ], function (skrollr, App, Jsmpeg) {
    'use strict';

    var Tablet = function() {

      this.mainSkrollr = {};

      this.bgVideos = [];

      this.bgMpegVideos = [];

      this.bgVideosLoaded = false;

      this.videoOffset = $("#story1_video").height();

      this.init();

    };

    Tablet.prototype.init = function() {
      var _this = this;
      var videoTimeElapsed = 0;
      var mainStoryVideo;
      var homeGlobeBgImgUrls = [
        '/assets/images/homepage/masks/ee.jpg',
        '/assets/images/homepage/masks/mm.jpg',
        '/assets/images/homepage/masks/neesha.jpg',
        '/assets/images/homepage/masks/lian.jpg'
      ];
      var randNumb = getRandomInt(0,homeGlobeBgImgUrls.length);

      // ------------------------------------------------------------
      // Global JS
      // ------------------------------------------------------------
      $('#menu-cta').on('click', function(e) {
        e.preventDefault();
        $(this).toggleClass('close');
        $('#menu').toggleClass('active');
      });

      $(".abovefold-caret-down, .explore-more").on('click',function(){
        $(this).fadeOut(300);
        _this.mainSkrollr.animateTo($(window).height() - 160);
      });

      var ua = navigator.userAgent.toLowerCase();
      var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");
      if(isAndroid) {
        $("#story1_video").addClass('no-fullscreen');
      }

      $("html,body").scrollTop();

      // allows to scroll the main page within the iframe
      this.mainSkrollr = skrollr.init({
        smoothScrolling:true,
        forceHeight: false,//disable setting height on body
        mobileDeceleration:0.05,
        smoothScrollingDuration:200
      });

      // load those assets late!
      lazyLoadImages();
      lazyLoadVideos();

      // Hackedy hacky hack - rotate ipad flashes due to weird iframe media queries, so hide it until js ready !
      $("#rotate-ipad").css("bottom",0);

      // $(document).ready(function(){ // READY NOT FIRED ON TABLET ? WHY ?

      // ------------------------------------------------------------
      // Homepage JS
      // ------------------------------------------------------------
      if($("#main.homepage").length){

        //this is now hardcoded
        // App.newsBanner.init();

        $("#preload-img").hide()
        .one('load', function() {

          $(this).remove();

          $(".fb-loader-wrapper").fadeOut(600,function(){

            $("body").addClass("show-top-banner");

            if(window.location.hash==="#stories"){
              setTimeout(function(){
                _this.mainSkrollr.animateTo($(document).height()*2);
              },300);
            }
          });

          $("#intro .homepage-bg").css('background-image','url('+homeGlobeBgImgUrls[randNumb]+')');

          $(".stories-right").on('touchstart',function(e){
            $("#stories-gallery").addClass('slide-right');
          });

          $(".stories-left").on('touchstart',function(e){
            $("#stories-gallery").removeClass('slide-right');
          });

        })
        .attr('src', homeGlobeBgImgUrls[randNumb])
        .each(function() {
          if(this.complete) $(this).trigger('load');
        });
      }

      // ------------------------------------------------------------
      // Story JS
      // ------------------------------------------------------------
      if($("#main.story").length){

       // this.handleScroll();

        if($("#page-wrapper.story3").length){
          var colorWindmillTop = $("#color-windmill").offset().top - 200;
          $(window).scroll(function() {
            if($(window).scrollTop() > colorWindmillTop) {
              $("#color-windmill").addClass('active');
            }
          });
        }

        $(".main-video-poster").fadeOut(300,function(){
          $("#story1_video").show();
        });

        $("#main-video-poster-preload").hide()
        .one('load', function() {
          $(".fb-loader-wrapper").fadeOut(600);
        })
        .attr('src', $("#main-video-poster-preload").attr('data-src'))
        .each(function() {
          if(this.complete) $(this).trigger('load');
        });

        if($("#story1_video").length){

          videojs("story1_video").ready(function(){
            mainStoryVideo = this;
            $(".btn-play-wrapper").on('click', function(e){
              $(".fade-out-after-scroll").fadeOut(300);
              $("#video-container .vjs-control-bar").fadeIn(300);
              mainStoryVideo.play();
              $("body").addClass('main-video-mode');
              $("#main .intro, #main .black-bg, .desk-video-cover, #hero-bg ").fadeOut(600);
              fitMainVideo();
              $("#story1_video_html5_api")[0].addEventListener("canplay", function(){
                mainVideoDimensionFunction($("#video-container"));
              });
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
            $("#video-container .vjs-control-bar, #hero-bg").fadeOut(300);
            App.analytics.trackEvent("story-video", "video-watch", $("#story1_video").data("story") + "-ended");
          });

          videojs("story1_video").on("timeupdate", function() {
            var currentTime = parseInt(this.F.currentTime);
            if(currentTime !== 0 && currentTime % 5 === 0) {
              if(videoTimeElapsed !== currentTime) {
                videoTimeElapsed = currentTime;
                App.analytics.trackEvent('story-video', 'video-watch', $("#story1_video").data('story') + "-watch-" + currentTime + "-seconds");
              }
            }
          });

          // main story videojs functions
          $(".vjs-control-bar").after($(".btn-fullscreen-video"));

          // ------------------------------------------------------------
          // Event Listeners for Story
          // ------------------------------------------------------------
          $(".btn-fullscreen-video").on('click',function(e){
            e.preventDefault();
            e.stopPropagation();
            $(".vjs-fullscreen-control").click();
          });

          $(".vjs-play-control").on('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            if($(".video-js.vjs-paused").length === 0){
              mainStoryVideo.pause();
            } else {
              mainStoryVideo.play();
            }
          });

          $(".back-to-stories").on('touchstart', function(e){
            if($("body").hasClass('main-video-mode') && $(".back-to-stories.skrollable.skrollable-after").length === 0){
              e.preventDefault();
              e.stopPropagation();
              $("body").removeClass('main-video-mode');
              $("#main .intro,.desk-video-cover,#hero-bg ").fadeIn(300);
              $("#main .share-video").fadeOut(300);
              mainStoryVideo.pause();
              mainStoryVideo.currentTime(0);
            }
          });

          $(".btn-replay").on('touchstart',function(e){
            e.preventDefault();
            e.stopPropagation();
            $("#video-container .vjs-control-bar").fadeIn(300);
            $("#main .share-video,#hero-bg").fadeOut(300);
            mainStoryVideo.currentTime(0);
            mainStoryVideo.play();
          });
        }
      }
    };

    Tablet.prototype.setupMpegs = function() {
      var $videoNodes = $('.mpeg-video');
      var _this = this;

      $videoNodes.each(function(i, v) {

        //add the canvas element
        v.style.width= '100%';
        var canvas = document.createElement( 'canvas' );
        canvas.width = v.getAttribute( 'data-video-width' );
        canvas.height = v.getAttribute( 'data-video-height' );
        v.appendChild(canvas);
        var height = canvas.height/canvas.width * $(window).width();
        if((App.browser.isIE)) {
          $(canvas).css('height', height);
        }
        //create the video object
        var video = {};
        video.$container = $(this);
        video.startOffset = Math.max($(this).offset().top - ($(window).height()), 0);
        video.stopOffset = $(this).offset().top + $(this).outerHeight() - $('header').height();
        video.isLoaded = false;
        video.isPlaying = false;

        video.element = new Jsmpeg( v.getAttribute( 'data-src' ), {
            forceCanvas2D: false,
            canvas: canvas,
            autoplay: false,
            loop: ( v.getAttribute( 'data-loop' ) === 'true' ),
            onload: function() {
              _this.onMpegLoad();
            }
          });

          //cache all video objects
          _this.bgMpegVideos.push(video);
      });
    };

    Tablet.prototype.onMpegLoad = function() {
      var _this = this;
      setTimeout(function() {
        _this.playMpeg(_this.bgMpegVideos[0]);
      }, 200);
    };

    Tablet.prototype.handleScroll = function() {

      var _this = this;
      $(window).on('scroll', function() { //surface uses scroll
        _this.onScroll();
      });

      $(document.body).on('touchmove scroll', function() {
        _this.onScroll();
      });
    };

    Tablet.prototype.onScroll = function() {
      var _this = this;
      var scrollPos = this.mainSkrollr.getScrollTop();

      if(scrollPos >= this.videoOffset) {
        if(!videojs("story1_video").paused()) {
           videojs("story1_video").pause();
        }
      }
    };

    Tablet.prototype.playMpeg = function(video) {
      if(!video.isPlaying) {
        video.element.play();
        video.isPlaying = true;
        video.$container.addClass('playing');
      }
    };

    Tablet.prototype.pauseMpeg = function(video) {
      if(video.isPlaying) {
        video.element.pause();
        video.isPlaying = false;
        video.$container.removeClass('playing');
      }
    };

    Tablet.prototype.setupVideos = function() {
      var _this = this;
      $('.bg-video').each(function(index) {
        var video = {};
        video.element = $(this)[0];
        video.startOffset = Math.max($(this).offset().top - ($(window).height() * 2), 0);
        video.stopOffset = $(this).offset().top + $(this).height() - $('header').height();

        video.isPlaying = false;
        _this.bgVideos.push(video);

       $(video.element).on('playing', function(e) {
           $(video.element).addClass('playing');
       });

        $(video.element).on('pause', function() {
          $(video.element).removeClass('playing');

        });

      });
    };

    Tablet.prototype.playVideo = function(video) {
      var _this = this;
      video.play();

      if(video.readyState !== 4) {
        video.pause();
        video.addEventListener('canplaythrough', function() {
          _this.onCanPlay(video);
        }, false);
        video.addEventListener('load', function() {
          _this.onCanPlay(video);
        }, false); //add load event as well to avoid errors, sometimes 'canplaythrough' won't dispatch.
        setTimeout(function(){
          video.pause(); //block play so it buffers before playing
        }, 1); //it needs to be after a delay otherwise it doesn't work properly.
      }
    };

    Tablet.prototype.onCanPlay = function(video) {
      var _this = this;
      video.removeEventListener('canplaythrough', _this.onCanPlay, false);
      video.removeEventListener('load', _this.onCanPlay, false);

      video.play();
    };

  return Tablet;
});

// ------------------------------------------------------------
// Functions
// ------------------------------------------------------------

function lazyLoadImages(){
  $(".lazyload-img").each(function(i,obj){
    $(obj).css('background-image',$(obj).attr('data-background-image'));
  });
}

function lazyLoadVideos(){
  $(".lazyload-video").each(function(i,obj){
    $(obj)[0].play();
  });
}

function fitMainVideo(){
  $("#main").toggleClass('fullscreen-video-mode');
  mainVideoDimensionFunction($("#video-container"));
  if($("#main").hasClass('fullscreen-video-mode')){
    $('.fullscreen-video').width($(window).width());
  } else {
    $('.fullscreen-video').width('100%');
  }
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
  var videoContainerAspectRatio = $container.height()/$container.width();
  if (videoAspectRatio > videoContainerAspectRatio){
    $('#story1_video_html5_api').width($container.width()*1);
    $('#story1_video_html5_api').height($container.width()*videoAspectRatio);
  }
  else{
    $('#story1_video_html5_api').height($container.height()*1);
    $('#story1_video_html5_api').width($container.width()*videoAspectRatio);
  }
}

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}




