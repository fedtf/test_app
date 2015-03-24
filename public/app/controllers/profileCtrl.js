app.controller('profileCtrl', function($scope, userIdentity) {
    $scope.user = userIdentity.user;
});