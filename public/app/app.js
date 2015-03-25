var app = angular.module('app', ['ngResource', 'ngRoute', 'angularModalService', 'angular-loading-bar']);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/partials/main',
            controller: 'mainCtrl'
        })
        .when('/create-table', {
            templateUrl: '/partials/table',
            controller: 'createTableCtrl'
        })
        .when('/users/:username', {
            templateUrl: '/partials/profile',
            controller: 'profileCtrl'
        })
        .when('/register', {
            templateUrl: '/partials/register',
            controller: 'registerCtrl'
        })
        .when('/tables/:tableId', {
            templateUrl: '/partials/table',
            controller: 'tableCtrl'
        })
});