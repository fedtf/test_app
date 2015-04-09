app.controller('mainCtrl', function($scope, numbers, $upload, $location, tableService, notifier) {

    $scope.numbers = numbers;

    $scope.inc = numbers.inc;

    $scope.dec = numbers.dec;

    $scope.$watchCollection('numbers', function() {
        console.log($scope.numbers.problemsNumber);
        console.log($scope.numbers.studentsNumber);
        tableService.renderArray();
    });

    $scope.inputClick = function(val) {
        if (+val === 0) {
            return '';
        } else {
            return val;
        }
    };

    $scope.upload = function(file) {
        if (file && file.length) {
            console.log(file);
            $upload.upload({
                url: '/api/parse-user-file',
                file: file
            }).progress(function (evt) {
                var percentage = 100.0 * evt.loaded / evt.total;
                console.log('loaded ' + percentage + ' % of file ' + evt.config.file.name);
                console.log(evt);
            }).success(function (data, status, config) {
                console.log(data);
                var arrayReceived = data.wrightAnswersArray;
                $location.path('/create-table/' + arrayReceived.length + '/' + arrayReceived[0].problems.length);
                tableService.wrightAnswersArray = arrayReceived;
                console.log(tableService.wrightAnswersArray);
            }).error(function(res) {
                notifier.notifyError('Что-то пошло не так, попробуйте еще раз');
            });
        }
    }

});