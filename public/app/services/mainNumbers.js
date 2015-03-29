app.service('numbers', function Numbers($rootScope) {
    var self = this;

    self.studentsNumber = 0;
    self.problemsNumber = 0;


    self.inc = function(value) {

        if (value + 1 > 1000) {
            return +value;
        } else {
            return +value + 1;
        }


    };

    self.dec = function(value) {
        if (value - 1 < 0) {
            return +value
        } else {
            return +value - 1;
        }
    };


});