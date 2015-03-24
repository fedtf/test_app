app.controller('loginCtrl', function($scope, $http, userIdentity, notifier, clientAuth, $location) {

    $scope.userIdentity = userIdentity;

    $scope.signIn = function(username, password) {
        clientAuth.logIn(username, password).then(function(success) {
            if (success) {
                notifier.notifySuccess('Вход успешно выполнен');
            } else {
                notifier.notifyError('Неверный логин или пароль');
            }
        })
    };

    $scope.signOut = function() {
        clientAuth.logOut().then(function() {
            $scope.username = '';
            $scope.password = '';
            notifier.notifySuccess('Выход успешно выполнен');
            $location.path('/');
        })
    }
})