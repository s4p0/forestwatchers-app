(function() {
    'use strict';

    angular.module('myApp', ['ngRoute', 'ngTouch', 'ngAnimate', 'myApp.services', 'myApp.controllers'])
        .config(function($routeProvider, $compileProvider) {
            $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|file|blob|content):|data:image\//);
            $routeProvider
                .when('/', {
                    controller: 'MainCtrl',
                    templateUrl: 'partials/main.html'
                })
                .when('/view', {
                    controller: 'ViewCtrl',
                    templateUrl: 'partials/view.html'
                })
                .when('/login', {
                    controller: 'ViewCtrl',
                    templateUrl: 'partials/login.html'
                })
                .when('/image', {
                    controller: 'ImageCtrl',
                    templateUrl: 'partials/images.html'
                });
                // .otherwise({
                //     redirectTo: '/'
                // });
        });


})();