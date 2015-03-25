app.controller('tableCtrl', function($scope, $routeParams, $http, tableService, notifier, userIdentity, tableCheck) {

    $http.get('/api/tables/' + $routeParams.tableId).then(function (res) {

        $scope.tableName = res.data.tableName;
        $scope.wrightAnswersArray = res.data.wrightAnswersArray;
        $scope.tableCheck = tableCheck;

        tableService.wrightAnswersArray = $scope.wrightAnswersArray;
        $scope.tableService = tableService;
        console.log(res);

        $scope.$watch('wrightAnswersArray', function() {
            tableService.renderRightArray();
            tableService.renderDownArray();
            tableService.renderCorrelationArray();
            tableService.renderDownCorrelationArray();
            console.log('changed')
        }, true);

    }, function(reason) {
        notifier.notifyError(reason)
    });

    $scope.edit = false;

    $scope.toggleEdit = function() {
        return $scope.edit = !$scope.edit;
    };

    $scope.updateTable = function() {

        var newTableData = {
            userId: userIdentity.user._id,
            wrightAnswersArray: tableService.wrightAnswersArray,
            correlationArray: tableService.correlationArray,
            downArray: tableService.downArray,
            rightArray: tableService.rightArray
        };

        $http.put('/api/tables/' + $routeParams.tableId, newTableData).then(function(success) {
            if (success) {
                notifier.notifySuccess('Данные обновлены');
            } else {
                notifier.notifyError('Что-то пошло не так попробуйте позже');
            }
        }, function () {
            notifier.notifyError('Что-то пошло не так попробуйте позже');
        });

        $scope.toggleEdit();
    }

});