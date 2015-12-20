define(['jquery',
    'tweenMax',
    'preloadjs'
], function ($, TweenMax, preloadjs) {
  'use strict';

  var ImageSequence = function(el, path, imageName, length) {

    this.images = [];

    this.length = length;

    this.path = path;

    this.imageName = imageName;

    this.$el = el;

    this.sprites = -1;

    this.spritesJSON = [];

    this.frames = [];

    this.curSprite = 0;

    this.$image = $('#' + this.imageName + this.curSprite);

    this.curFrame = -1;

    this.frameLength = 0;

    this.direction = 'forwards';

    this.sequenceInterval;
  };

  ImageSequence.prototype.destroy = function() {
    var _this = this;
    window.clearRequestInterval(_this.sequenceInterval);
  };

  ImageSequence.prototype.scaleImageSequence = function() {
    var elWidth = $('.image-sequence').width();
    var windowWidth = $(window).width();
    var scale = windowWidth/elWidth;

    TweenMax.set($('.image-sequence'), {'transform' : 'scale(' + scale + ')'});

    $('.image-sequence').show();

  };


  ImageSequence.prototype.init = function() {
    var start = null;
    var _this = this;


    var jsonPreload = new createjs.LoadQueue();
      jsonPreload.addEventListener('fileload', function(e) {
        _this.handleJSONLoaded(e);
      });

    for(var i = 0; i < this.length; i++) {
      jsonPreload.loadFile(_this.path + _this.imageName + i + '.json');
    }
  };

  ImageSequence.prototype.playBackwards = function() {
    this.curFrame--;
    if(this.curFrame == 0) {
      this.curSprite--;
      if(this.curSprite < 0) {
        this.curSprite = 0;
        this.curFrame = 0;
        this.direction = 'forwards';
        return;

      }
      this.frameLength = this.spritesJSON[this.curSprite].length;
      this.curFrame = this.frameLength - 1;


      $('.image-sequence .image').hide();
      this.$image = $('#' + this.imageName + this.curSprite);
      this.$image.show();
    }
    this.updateImage();
  };

  ImageSequence.prototype.playForwards = function() {

    this.frameLength = this.spritesJSON[this.curSprite].length;
    this.curFrame++;

    if(this.curFrame == this.frameLength) {
      this.curFrame = 0;
      this.curSprite++;
      if(this.curSprite == this.length) {
        this.curSprite = this.length - 1;
        this.curFrame = this.frameLength;
        this.direction = 'backwards';

        return;
      }
      $('.image-sequence .image').hide();
      this.$image = $('#' + this.imageName + this.curSprite);
      this.$image.show();

    }

    this.updateImage();
  };


  ImageSequence.prototype.handleJSONLoaded = function(e) {
    var _this = this;
    $(e.result).each(function(i, val) {
      _this.sprites++;
      _this.spritesJSON[_this.sprites] = [];
      $.each(val.frames, function(i, val) {
        _this.spritesJSON[_this.sprites].push(val.frame);
      });
      if(_this.sprites == _this.length - 1) {
        _this.sequenceInterval = window.requestInterval(function() {
          _this.updateFrame();
        }, 60);
      }
    });
  };

  ImageSequence.prototype.updateFrame = function(timestamp) {

      if(this.direction == 'forwards') {
        this.playForwards();
      } else {
        this.playBackwards();
      }

  };

  ImageSequence.prototype.updateImage = function() {
    var x = -1 * this.spritesJSON[this.curSprite][this.curFrame].x + 'px';
    var y = -1 * this.spritesJSON[this.curSprite][this.curFrame].y + 'px';

    this.$image.css('background-position', x + ' ' + y);
  };

  return ImageSequence;

});
