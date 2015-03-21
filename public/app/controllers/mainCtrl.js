app.controller('mainCtrl', function($scope, numbers) {

    $scope.numbers = numbers;

    $scope.inc = numbers.inc;

    $scope.dec = numbers.dec;

});