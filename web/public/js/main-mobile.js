/*global require*/

require.config({

    urlArgs: "bust=v2",
    paths: {
        'app': 'app',
        'utils': 'common/utils',
        'jquery': 'libs/jquery/jquery.min',
        'tweenMax': 'libs/greensock/TweenMax.min',
        'preloadjs': 'libs/createjs/preloadjs-0.6.0.min',
        'slick': 'libs/slickjs/slick.min',
        'skrollr': 'libs/skrollr/skrollr.min'
    },
    shim: {
        tweenMax: {
            exports: 'TweenMax'
        },
        jsmpg: {
            exports: 'jsmpeg'
        }
    }
});

require(['app',
        'utils',
        'tweenMax',
        'common/analytics',
        'mobile/common/nav',
        'mobile/common/router',
        'mobile/views/home',
        'mobile/views/story',
        'mobile/common/image-sequence'
    ], function (App, Utils, TweenMax, Analytics, Nav, Router, Home, Story, ImageSequence) {

    'use strict';

    if(/iPhone|iPod/i.test(navigator.userAgent)) {
        var ua = navigator.userAgent;
        var start = ua.indexOf( 'OS ' );    
        var version = window.Number( navigator.userAgent.substr( start + 3, 2).replace( '_', '.' ) );
        App.useragent = 'iOS';
        $('body').addClass('ios ios' + version);
    }

    App.utils = new Utils();
    App.utils.init();

    App.analytics = new Analytics();

    App.deviceOrientation = App.utils.getDeviceOrientation();

    App.initialized = false;

    App.nav = new Nav();

    $(document.body).on('imagesLoaded', function() {
         TweenMax.to(App.$loader, .3, {
            opacity: 0,
            'onComplete': function() {
                App.$loader.hide();
            }
        });

        if(App.deviceOrientation == 'portrait') {
            initApp();
        } else {
            $(window).on('orientationchange resize',function(){
              App.deviceOrientation = App.utils.getDeviceOrientation();
              if(App.deviceOrientation == 'portrait') {
                initApp();
              }
            });
        }
    });

    App.$loader = $('.fb-loader-wrapper');
    App.imagesToLoad = $('.image-preload').size();
    App.imagesLoaded = 0;


    if(App.imagesToLoad > 0) {
        $('.image-preload').each(function(i) {
            $(this).attr('src', $(this).data('src')).load(function() {
                App.imagesLoaded++;
                if(App.imagesLoaded == App.imagesToLoad) {
                    $(document.body).trigger('imagesLoaded');
                }
            });
        });
    } else {
        $(document.body).trigger('imagesLoaded');
    }

    function initApp() {
        if(!App.initialized) {
            if($('body').hasClass('home')) {
                App.home = new Home();
            } else if($('body').hasClass('story')) {
                App.story = new Story();
            }

            App.initialized = true;
        }
    };
});
