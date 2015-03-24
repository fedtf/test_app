app.service('userIdentity', function($window) {
    this.user = $window.bootstrapedUser;
    this.isAuthorised = function() {
        return !!this.user;
    }
});