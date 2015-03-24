app.controller('mainCtrl', function($scope, numbers) {

    $scope.numbers = numbers;

    $scope.$watchGroup(['numbers.problemsNumber', 'numbers.studentsNumber'], function(newValues){
        numbers.problemsNumber = +newValues[0];
        numbers.studentsNumber = +newValues[1];
    })

    $scope.inc = numbers.inc;

    $scope.dec = numbers.dec;

});