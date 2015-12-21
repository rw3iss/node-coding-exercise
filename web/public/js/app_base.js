var cl = function() {
  if(typeof console != 'undefined') {
    console.log.apply(console, arguments);
  }
}

var app = { directive: {}, factory: {}, service: {}, controller: {}, filter: {} };

app.service.Service = function() {
    return {
        url: BASE_URL,
        
        init: function () {
        },

        request: function (requestURL, jsonData, callback, errorCallback) {
            var me = this;
            var asyncVal = true;
            
            if(typeof jsonData.async != 'undefined')
                asyncVal = jsonData.async;
            
            $.ajax({
                type: "post",
                async: asyncVal,
                //contentType: 'application/json; charset=utf-8',
                url: me.url + requestURL,
                data: jsonData,
                success: function (result) {
                    if(Blobs.UI.loading != null) {
                        Blobs.UI.loading.hide();
                    }
                    var rJson = $.parseJSON(result);
                    if(rJson && typeof rJson.errorType != 'undefined') {
                        if(typeof(errorCallback != 'undefined')) {
                            alert("ERROR: " + result);
                            errorCallback(rJson);
                        }
                    }
                    else if (typeof callback != 'undefined') {

                        callback(rJson);
                    }
                }
            });
        }
    }
};

app.directive['eatClick'] = function() {
    return function(scope, element, attrs) {
        $(element).click(function(event) {
            event.preventDefault();
            event.stopPropagation();
        });
    }
};


app.directive['lazyShow'] = function($timeout) {
    return function(scope, element, attrs) {
        $timeout(function() {
            $(element).show();
        });
    }
};

app.directive['lazyShowWithModel'] = function($timeout, $rootScope) {
    return { 
        restrict: 'A',
        scope: false,
        link:  function(scope, element, attrs, controller) {
            var modelName = element.attr('lazy-model');

            if(modelName) {
                scope.$watch(modelName, function() {
                    var val = scope[modelName];
                    if(val) {
                        $(element).show();
                    }
                });
            }
        }
    }
};



app.directive.hiddeninput = function($timeout) {
    return { 
        restrict: 'A',
        scope: false,
        link: function(scope, el, attrs) {
            el = $(el);

            var label = el.find('.read-label');
            var text = label;
            if(!text.hasClass('.text')) {
                text = label.find('.text');
            }
            var input = el.find('.hidden-input');

            var prevVal = "";

            label.click(function() {
                label.hide();
                input.show();
                input.focus();
                input.select();
                prevVal = input.val();
            });

            input.bind('blur', function(e) {
                var val = input.val().trim();
                input.val(val);
                text.text(val);

                input.hide();
                label.show();
            });
            
            input.bind('keydown', function(e) {
                if (e.keyCode == 13) { //enter
                    input.blur();
                }
                else if (e.keyCode == 27) {
                    //input.val('');
                    input.val(prevVal);
                    text.text(prevVal);
                    input.blur();
                }
            });
        }
    }
};


app.directive['saveOnEnter'] = function($timeout) {
    return { 
        restrict: 'A',
        scope: false,
        link: function(scope, el, attrs) {
            el = $(el);
                
            el.bind('keydown', function(e) {
                if (e.keyCode == 13) { //enter
                    el.blur();
                }
            });
        }
    }
};

app.directive['blurCallback'] = function () {
    return { 
        restrict: 'A',
        scope: true,
        link: function(scope, el, attrs) {
            el = $(el);

            el.bind('blur', function () {
                var fn = scope[attrs.callback];
                fn(el.val());
            });
        }
    }
};

app.directive['keyupEvent'] = function () {
    return { 
        restrict: 'A',
        scope: false,
        link: function(scope, el, attrs) {
            el = $(el);

            var ev = attrs.event;
            el.keyup(function () {
                scope.$emit(ev, el.val());      
            });
        }
    }
};


app.directive['ngChangeOnEscape'] = function() {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, elm, attr, ngModel) { 
            var change = attr['ngChange'];
            if(!change)
                return;

            change = change.replace('(','').replace(')','');

            var el = $(elm);
            el.keyup(function(e) {
                if(e.which == 27) {
                    var fn = scope[change];
                    if(fn)
                        fn(el.val());
                }
            });
        }
    };
};

//updates the model on blur
app.directive['ngModelOnBlur'] = function($rootScope) {
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, elm, attr, ngModel) {
            if (attr.type === 'radio' || attr.type === 'checkbox') 
                return;     

            var blurEvent = attr.blurEvent;

            var el = $(elm);
            el.keypress(function(e) {
                if(e.which == 13 && !e.shiftKey) {
                    el.blur();
                }
            });

            elm.unbind('input').unbind('keydown').unbind('change');
            elm.bind('blur', function() {
                var change = attr['ngChange'];

                scope.$apply(function() {
                    ngModel.$setViewValue(elm.val());

                    if(blurEvent != null) {
                        $rootScope.$broadcast(blurEvent, elm.val());
                    }
                    if(change != null) {
                        var fn = scope[change];
                        if(fn)
                            fn();
                    }
                });         
            });
        }
    };
};

app.service['delay'] = function($q, $timeout) {
    return {
        start: function (ms) {
            var deferred = $q.defer();
            $timeout(deferred.resolve, ms);
            return deferred.promise;
        }
    };
};