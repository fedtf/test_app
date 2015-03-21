app.service('tableService', function(numbers, $rootScope) {

    var self = this;

    self.toggleProblem = function(problem) {

        switch (problem[0]) {
            case 0:
                problem[0] = 1;
                break;
            case 1:
                problem[0] = 0;
                break;
            default: return
        }

    };

    self.wrightAnswersArray = [];

    self.renderArray = function() {

        for (var i = 0; i < numbers.studentsNumber; i++) {

            self.wrightAnswersArray[i] = [];
            self.wrightAnswersArray[i][0] = 'student';

            for (var j = 1; j < numbers.problemsNumber+1; j++) {
                self.wrightAnswersArray[i][j] = [];
                self.wrightAnswersArray[i][j][0] = 0;
                self.wrightAnswersArray[i][j][1] = j;

            }
        }

    };

    self.rightArray = [];

    self.renderRightArray = function() {


        self.rightArray = [];

        for (var i = 0; i < self.wrightAnswersArray.length; i++) {

            var sum = 0;

            for (var j = 1; j < self.wrightAnswersArray[i].length; j++) {
                sum += +self.wrightAnswersArray[i][j][0];
            }
            self.rightArray.push(sum);
        }

    }



});