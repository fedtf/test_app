app.controller('profileCtrl', function($scope, userIdentity, $http, notifier) {
    $scope.user = userIdentity.user;
    $http.get('/api/user-tables/' + $scope.user._id).then(function(res) {
        $scope.userTables = res.data;
        console.log($scope.userTables);

    });
    $scope.exportTable = function(table, type) {
        $('body').append($("<iframe src='/export/" + JSON.stringify(table) + "/" + type + "' style='display:none'>"));
    };
    $scope.deleteTable = function(table, index) {
        $http.delete('/api/tables/' + table._id).then(function(success) {
            if (success) {
                notifier.notifySuccess('Таблица успешно удалена');
                $scope.userTables.splice(index, 1);
            } else {
                notifier.notifyError('Что-то пошло не так, попробуйте позже');
            }
        });
    }
});