app.controller('createTableCtrl', function($scope, numbers, tableService, ModalService, userIdentity, $routeParams, tableCheck) {
    $scope.numbers = numbers;

    $scope.numbers.studentsNumber = +$routeParams.studentsNumber;
    $scope.numbers.problemsNumber = +$routeParams.problemsNumber;

    $scope.createMode = true;
    $scope.edit = true;

    $scope.userIdentity = userIdentity;

    $scope.wrightAnswersArray = tableService.wrightAnswersArray;

    $scope.tableService = tableService;

    $scope.tableCheck = tableCheck;

    $scope.removeElement = tableService.removeElement;

    if (!tableService.wrightAnswersArray.length) {
        tableService.renderArray();
    }

    $scope.$watch('wrightAnswersArray', function() {
        tableService.renderRightArray();
        tableService.renderDownArray();
        tableService.renderCorrelationArray();
        tableService.renderDownCorrelationArray();
    }, true);

    $scope.showSaveModal = function() {
        ModalService.showModal({
            templateUrl: '/partials/saveModal',
            controller: 'saveTableCtrl'
        }).then(function(modal) {
            modal.element.modal();
        })
    }
});

