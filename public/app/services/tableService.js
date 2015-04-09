app.service('tableService', function(numbers, $rootScope) {

    var self = this;

    self.toggleProblem = function(problem) {

        if (problem[0] == 0) {
            return problem[0] = 1;
        } else return problem[0] = 0;
    };

    self.wrightAnswersArray = [];

    self.renderArray = function() {

        self.wrightAnswersArray.splice(0, numbers.studentsNumber);

        for (var i = 0; i < +numbers.studentsNumber; i++) {

            self.wrightAnswersArray[i] = {};
            self.wrightAnswersArray[i].name = '';
            self.wrightAnswersArray[i].problems = [];

            for (var j = 1; j < +numbers.problemsNumber+1; j++) {

                self.wrightAnswersArray[i].problems.push([0, j]);
                //console.log(j);
            }
        }
    };

    self.renderRightArray = function() {


        self.rightArray = [];

        for (var i = 0; i < self.wrightAnswersArray.length; i++) {

            var sum = 0;

            for (var j = 0; j < self.wrightAnswersArray[i].problems.length; j++) {
                sum += +self.wrightAnswersArray[i].problems[j][0];
            }
            self.rightArray.push(sum);
        }

    };

    self.renderDownArray = function() {

        self.downArray = [];

        self.partSolvedSum = 0;
        self.dispersionSum = 0;

        for (var i = 0; i<self.wrightAnswersArray[0].problems.length; i++) {

            var sum = 0;

            for (var j = 0; j<self.wrightAnswersArray.length; j++) {
                sum += self.wrightAnswersArray[j].problems[i][0];
            }

//            console.log(self.partSolvedSum);
            self.partSolvedSum = +(self.partSolvedSum + sum/self.wrightAnswersArray.length).toFixed(2);
            self.dispersionSum = +(self.dispersionSum + sum/self.wrightAnswersArray.length*(1-sum/self.wrightAnswersArray.length)).toFixed(2);

            self.downArray.push(sum);
        }

        sum = 0;
        var sumSquared = 0;

        for (i = 0; i < self.rightArray.length; i++) {
            sum += self.rightArray[i];
            sumSquared += self.rightArray[i]*self.rightArray[i];
        }

        self.downArray.push(sum, sumSquared);
    };

    self.sqrt = function(val) {
        return Math.sqrt(val);
    };

    self.renderCorrelationArray = function() {
        var ss_array = [],
            sp = 0,
            res = 0,
            concatArr = angular.copy(self.wrightAnswersArray);

        self.correlationArray = [];

        for (var i = 0; i < concatArr.length; i++) {
            concatArr[i].problems.push([self.rightArray[i], 'Общий балл']);
        }


        for (i = 0; i < self.downArray.length-2; i++) {
            ss_array.push((self.downArray[i]-Math.pow(self.downArray[i], 2)/concatArr.length).toFixed(2));
        }

        ss_array.push((self.downArray[self.downArray.length-2]-self.downArray[self.downArray.length-1]/concatArr.length).toFixed(2));


        for (i = 0; i < concatArr[0].problems.length; i++) {
            self.correlationArray.push([concatArr[0].problems[i][1]]);
            for(var j = 0; j < concatArr[0].problems.length; j++) {
                for(var k=0; k < concatArr.length; k++) {
                    sp += concatArr[k].problems[i][0]*concatArr[k].problems[j][0];
                }
                sp -= (self.downArray[i]*self.downArray[j]/concatArr.length).toFixed(2);

                res = ((sp).toFixed(2)/(Math.sqrt(ss_array[i]*ss_array[j])).toFixed(2)).toFixed(3);

                if (isNaN(res)) res = 0;
                self.correlationArray[i].push(+res);
                sp = 0;
            }
        }

        console.log(self.correlationArray);

        self.correlationArray.sort(function(a, b) {
            if (typeof a[0] == 'string') return true;
            if (typeof b[0] == 'string') return false;
            return a[0] - b[0];
        });

        for (i = 0; i < self.correlationArray.length; i++) {
            for (j = 1; j < self.correlationArray[i].length-1; j++) {
                var saveValue = self.correlationArray[i][j];
                self.correlationArray[i][j] = [saveValue, self.wrightAnswersArray[0].problems[j-1][1]];
            }
        };

        console.log(self.correlationArray);

        for (i = 0; i < self.correlationArray.length-1; i++) {

            for (var j = 2; j < self.correlationArray[i].length-1; j++) {
                var elem = self.correlationArray[i][j];
                var k = j-1;
                while ((elem[1] < self.correlationArray[i][k][1]) && (k >= 1)) {
                    self.correlationArray[i][k+1] = self.correlationArray[i][k];
                    k -= 1;
                }
                self.correlationArray[i][k+1] = elem;

            }

            for (j = 1; j < self.correlationArray[i].length-1; j++) {
                self.correlationArray[i][j] = self.correlationArray[i][j][0];
            }
        };
    };

    self.renderDownCorrelationArray = function() {
        self.downCorrelationArray = [];
        var sum = 0;

        for (var i = 1; i < self.correlationArray.length; i++) {
            for (var j = 0; j < self.correlationArray[i].length-2; j++) {
                sum += self.correlationArray[j][i];
                console.log(self.correlationArray[j][i]);
            }
            console.log(sum);
            self.downCorrelationArray.push(+sum.toFixed(2));

            sum = 0;
        }

    };

/*    self.removeElement = function(toDelete) {
        var toDeleteArr = toDelete.match(/((\W\d+\W)|(\w+)|(.*[\u0400-\u04FF]+.*))/g);
        for (var i = 0; i < toDeleteArr.length; i++) {
            if (isNaN(toDeleteArr[i])) {
                removeStudent(toDeleteArr[i]);
            } else {
                removeProblem(toDeleteArr[i]);
            }
        }
    };*/

    self.removeProblem = function(problem) {
        for (var j = 0; j < self.wrightAnswersArray.length; j++) {
                for (var k = 0; k < self.wrightAnswersArray[j].problems.length; k++) {
                    if (self.wrightAnswersArray[j].problems[k][1] == problem) {
                        self.wrightAnswersArray[j].problems.splice(k, 1);
                    }
                }
            }
    };

    self.removeStudent = function(studentIndex) {
        self.wrightAnswersArray.splice(studentIndex, 1);
        console.log(studentIndex);
    };

    self.edit = false;

    self.emptyStudentsInputs = function() {
        var empty = false;
        for (i = 0; i < self.wrightAnswersArray.length; i++) {
            if (!self.wrightAnswersArray[i].name.length) {
                empty = true;
                break;
            }
        }
        return empty;
    }

});

