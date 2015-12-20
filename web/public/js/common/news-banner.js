define([
], function () {
  'use strict';

  var NewsBanner = function() {
  };

  NewsBanner.prototype.init = function() {
    $.ajax({
      url: '/api/news',
      success: function(res){
        if ( res.title ) {
            $( "#updates-wrapper h2" ).html( res.title );
        }

        if (res.data.length === 0){
          $("#banner").hide();
        } else {
          $("#banner").attr('href',res.data[0].url);
        }
        $.each(res.data, function(i,obj){
          $("#updates-wrapper").append(
            '<div class="update" data-href="' + obj.url + '">' +
              '<span>' + obj.copy + '</span>' +
              '<span class="arrow"><em class="fa fa-chevron-right"></em></span>' +
            '</div>');
        });
        bannerRotateUpdates();
      },
      dataType: 'json'
    });
  };

  return NewsBanner;

});
