/*global require*/

require.config({
  paths: {
    'newsBanner': 'common/news-banner',
    'touchController': 'common/touch-controller',
    'tweenMax': 'libs/greensock/TweenMax.min',
    'preloadjs': 'libs/createjs/preloadjs-0.6.0.min',
    'skrollr': 'libs/skrollr/skrollr.min',
    'jsmpg': 'libs/jsmpg/jsmpg'
  },
  shim: {
    tweenMax: {
      exports: 'TweenMax'
    },
    preloadjs: {
     exports: 'createjs.LoadQueue'
   },
   jsmpg: {
      exports: 'jsmpeg'
   }
 }
});

require(['app', 'tablet', 'common/analytics', 'touchController', 'newsBanner', 'common/detect-browser' ],
  function (App, Tablet, Analytics, TouchController, NewsBanner, Browser) {

  'use strict';

  App.touch = new TouchController($("#main-carousel"), 30, this);
  App.touch.init();
  
  App.newsBanner = new NewsBanner();

  App.browser = Browser;

  App.tablet = new Tablet();

  App.analytics = new Analytics();

});
