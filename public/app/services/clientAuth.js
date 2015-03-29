app.factory('clientAuth', function($http, userIdentity, $q) {
    return {
        logIn: function(username, password) {
            var dfd = $q.defer();
            $http.post('/login', {username: username, password:password}).then(function(response) {
                if (response.data.success) {
                    userIdentity.user = response.data.user;
                    dfd.resolve(true);
                } else {
                    dfd.resolve(false);
                }
            });

            return dfd.promise;
        },

        logOut: function() {
            var dfd = $q.defer();
            $http.post('/logout', {logout:true}).then(function() {
                userIdentity.user = undefined;
                dfd.resolve();
            });
            return dfd.promise;
        },

        register: function(newUserData) {
            var dfd = $q.defer();
            console.log('dfd');
            $http.post('/api/users', newUserData).then(function(response) {
                console.log('response!');
                    userIdentity.user = response.data.user;
                    dfd.resolve({success: true});
            }, function(response) {
                dfd.reject(response.data.reason);
            });

            return dfd.promise;

        },
        checkAuth: function() {
            var dfd = $q.defer();
            console.log('ehy');
            if (userIdentity.isAuthorised()) {
                dfd.resolve();
            } else {
                dfd.reject('not authenticated');
            }
            return dfd.promise;
           }
        }

});