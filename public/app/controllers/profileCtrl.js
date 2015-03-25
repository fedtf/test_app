app.controller('profileCtrl', function($scope, userIdentity, $http) {
    $scope.user = userIdentity.user;
    $http.get('/api/user-tables/' + $scope.user._id).then(function(res) {
        $scope.userTables = res.data;
        console.log(res);
    });
});