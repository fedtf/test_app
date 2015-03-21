app.controller('createTableCtrl', function($scope, numbers, tableService) {
    $scope.numbers = numbers;

    $scope.wrightAnswersArray = tableService.wrightAnswersArray;

    $scope.toggleProblem = tableService.toggleProblem;

    $scope.tableService = tableService;

    $scope.$watchCollection('numbers', function(val) {
        tableService.renderArray();
    });

    $scope.$watch('wrightAnswersArray', function() {
        tableService.renderRightArray();
    }, true)


});

