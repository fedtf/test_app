app.controller('saveTableCtrl', function($scope, $http, tableService, notifier, $location, $element) {
    $scope.saveTable = function() {
        $http.post('/api/tables', {
            tableName: $scope.tableName,
            wrightAnswersArray:tableService.wrightAnswersArray,
            correlationArray: tableService.correlationArray,
            downArray: tableService.downArray,
            rightArray: tableService.rightArray
        }).then(function(response) {
                notifier.notifySuccess('Таблица сохранена');
                $location.path('/tables/' + response.data._id);
                $element.modal('hide');
        }, function(reason) {
            notifier.notifyError(reason);
        });
    }
});