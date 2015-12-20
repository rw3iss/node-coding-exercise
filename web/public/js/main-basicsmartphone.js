/*global require*/

require.config({
    baseUrl: 'assets/js/mobile',
    paths: {
        'app': '../app',
        'utils': '../common/utils',
        'jquery': '../libs/jquery/jquery.min',
    },
    shim: {
    }
});

require(['app',
        'utils',
        'common/nav'
    ], function (App, Utils, Nav) {

    'use strict';

    App.utils = new Utils();
    App.utils.requestAnimationFrame();

    App.nav = new Nav();

});
