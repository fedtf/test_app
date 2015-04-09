app.controller('profileCtrl', function($scope, userIdentity, $http, notifier, tableService) {

    $scope.tableService = tableService;
    $scope.user = userIdentity.user;

    $scope.$on('$routeChangeSuccess', function(next, current) {
        console.log(current);
        if (current.locals.preloadUserTables.userTables) {
            $scope.userTables = current.locals.preloadUserTables.userTables;
        }
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