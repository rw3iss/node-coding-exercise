/*global require*/
require.config({
  paths: {
    'newsBanner': 'common/news-banner',
    'tweenMax': 'libs/greensock/TweenMax.min',
    'preloadjs': 'libs/createjs/preloadjs-0.6.0.min',
    'skrollr': 'libs/skrollr/skrollr.min'
  },
  shim: {
    tweenMax: {
      exports: 'TweenMax'
    },
    preloadjs: {
     exports: 'createjs.LoadQueue'
   }
 }
});

require(['app',
  'desktop',
  'common/analytics',
  'newsBanner'
  ], function (App,
     Desktop,
      Analytics,
      NewsBanner) {

  'use strict';

  App.newsBanner = new NewsBanner();

  App.desktop = new Desktop();

  App.analytics = new Analytics();

  App.newsBanner = new NewsBanner();
});
