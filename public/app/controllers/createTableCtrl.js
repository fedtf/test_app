app.controller('createTableCtrl', function($scope, numbers, tableService, ModalService, userIdentity) {
    $scope.numbers = numbers;

    $scope.createMode = true;
    $scope.edit = true;

    $scope.userIdentity = userIdentity;

    $scope.wrightAnswersArray = tableService.wrightAnswersArray;

    $scope.tableService = tableService;

    $scope.$watchCollection('numbers', function(val) {
        tableService.renderArray();
    });

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

