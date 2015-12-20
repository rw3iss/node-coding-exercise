// videojs.options.flash.swf = "/assets/js/libs/videojs/video-js.swf";
var sideCarousel,
  photoGalleryCarousel;

$(document).ready(function() {
  photoGalleryCarousel = $('#photo-gallery-carousel').slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    adaptiveHeight: true,
    onBeforeChange: transitionSideCarousel
  });
  sideCarousel = $('#side-carousel').slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    adaptiveHeight: true,
    onBeforeChange: transitionPhotoCarousel
  });
});

function transitionPhotoCarousel(obj, currentIndex, targetIndex) {
  var slideCount = $('#side-carousel .slick-dots li').length;
  if(currentIndex === 0 && targetIndex === slideCount-1){
    photoGalleryCarousel.slickPrev()
  } else if(currentIndex === slideCount-1 && targetIndex === 0){
    photoGalleryCarousel.slickNext()
  } else {
    photoGalleryCarousel.slickGoTo(targetIndex)
  }
}

function transitionSideCarousel(obj, currentIndex, targetIndex) {
  var slideCount = $('#side-carousel .slick-dots li').length;
  if(currentIndex === 0 && targetIndex === slideCount-1){
    sideCarousel.slickPrev()
  } else if(currentIndex === slideCount-1 && targetIndex === 0){
    sideCarousel.slickNext()
  } else {
    sideCarousel.slickGoTo(targetIndex)
  }
}