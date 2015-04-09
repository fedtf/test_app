app.controller('aboutCtrl', function($scope, ModalService) {
    $scope.showAboutModal = function() {
        console.log('hi!');
        ModalService.showModal({
            templateUrl: '/partials/aboutModal',
            controller: 'aboutCtrl'
        }).then(function(modal) {
            modal.element.modal();
        });
    }
});