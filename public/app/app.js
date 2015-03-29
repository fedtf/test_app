var app = angular.module('app', ['ngResource', 'ngRoute', 'angularModalService', 'angular-loading-bar', 'angularFileUpload']);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: '/partials/main',
            controller: 'mainCtrl'
        })
        .when('/create-table/:studentsNumber/:problemsNumber', {
            templateUrl: '/partials/table',
            controller: 'createTableCtrl'
        })
        .when('/users/:username', {
            templateUrl: '/partials/profile',
            controller: 'profileCtrl',
            resolve: {
                auth: function(clientAuth) {
                    return clientAuth.checkAuth();
                }
            }
        })
        .when('/register', {
            templateUrl: '/partials/register',
            controller: 'registerCtrl'
        })
        .when('/tables/:tableId', {
            templateUrl: '/partials/table',
            controller: 'tableCtrl',
            resolve: {
                auth: function(clientAuth) {
                    return clientAuth.checkAuth();
                },
                preloadTable: preloadTable

            }
        })
});

function preloadTable($http, $q, tableService, $route) {
    var dfd = $q.defer();
    console.log($route.current.params);
    $http.get('/api/tables/' + $route.current.params.tableId).then(function(res) {
        tableService.wrightAnswersArray = res.data.wrightAnswersArray;
        console.log(tableService.wrightAnswersArray);
        dfd.resolve({name: res.data.tableName});
    }, function(reason) {
        dfd.reject('table error');
    });
    return dfd.promise;
}

app.run(function($rootScope, $location, notifier) {
    $rootScope.$on('$routeChangeError', function(evt, current, previous, rejection) {
        if (rejection === 'not authenticated') {
            $location.path('/');
        } else if (rejection === 'table error') {
            notifier.notifyError('Что-то пошло не так, попробуйте позже');
        }
    })
});