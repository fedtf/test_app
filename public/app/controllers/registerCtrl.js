app.controller('registerCtrl', function($scope, clientAuth, notifier, $location) {

    $scope.register = function() {

        if ($scope.password !== $scope.secondPassword) {
            return notifier.notifyError('Пароль и подтверждение не совпадают');
        }

        var newUserData = {
            nickName: $scope.nickName,
            firstName: $scope.firstName,
            lastName: $scope.lastName,
            password: $scope.password
        };

        clientAuth.register(newUserData).then(function() {
                notifier.notifySuccess('Аккаунт успешно создан');
                $location.path('/');
        }, function(reason) {
            notifier.notifyError(reason);
            console.log(reason);
        })

    }
});