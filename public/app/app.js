var app = angular.module('app', ['ngResource', 'ngRoute']);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/partials/main',
            controller: 'mainCtrl'
        })
        .when('/create-table', {
            templateUrl: '/partials/create-table',
            controller: 'createTableCtrl'
        })
})