app.controller('tableCtrl', function($scope, $routeParams, $http, preloadTable, tableService, notifier, userIdentity, tableCheck) {

        $scope.tableName = preloadTable.name;
        $scope.wrightAnswersArray = tableService.wrightAnswersArray;
        $scope.tableCheck = tableCheck;

        console.log(tableService.wrightAnswersArray);

        $scope.tableService = tableService;

        $scope.$watch('wrightAnswersArray', function() {
            tableService.renderRightArray();
            tableService.renderDownArray();
            tableService.renderCorrelationArray();
            tableService.renderDownCorrelationArray();
            console.log('changed')
        }, true);

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
    };

    $scope.removeElement = tableService.removeElement;

});