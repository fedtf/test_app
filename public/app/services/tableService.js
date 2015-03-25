app.service('tableService', function(numbers, $rootScope) {

    var self = this;

    self.toggleProblem = function(problem) {

        problem[0] = !problem[0];

    };

    self.wrightAnswersArray = [];

    self.renderArray = function() {

        for (var i = 0; i < numbers.studentsNumber; i++) {

            self.wrightAnswersArray[i] = {};
            self.wrightAnswersArray[i].name = 'student';
            self.wrightAnswersArray[i].problems = [];

            for (var j = 1; j < numbers.problemsNumber+1; j++) {

                self.wrightAnswersArray[i].problems.push([false, j]);
                console.log(j);
            }
        }

        console.log(self.wrightAnswersArray);

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
    }

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
            concatArr[i].problems.push([self.rightArray[i], 0]);
        }


        for (i = 0; i < self.downArray.length-2; i++) {
            ss_array.push((self.downArray[i]-Math.pow(self.downArray[i], 2)/concatArr.length).toFixed(2));
        }

        ss_array.push((self.downArray[self.downArray.length-2]-self.downArray[self.downArray.length-1]/concatArr.length).toFixed(2));


        for (i = 0; i < concatArr[0].problems.length; i++) {
            self.correlationArray.push([]);
            for(var j = 0; j < concatArr[0].problems.length; j++) {
                for(var k=0; k < concatArr.length; k++) {
                    sp += concatArr[k].problems[i][0]*concatArr[k].problems[j][0];
                }
                sp -= (self.downArray[i-1]*self.downArray[j-1]/concatArr.length).toFixed(2);

                res = ((sp).toFixed(2)/(Math.sqrt(ss_array[i-1]*ss_array[j-1])).toFixed(2)).toFixed(3);

                if (isNaN(res)) res = 0;
                self.correlationArray[i].push(+res);
                sp = 0;
            }
        }

        console.log(self.correlationArray);
    };

    self.renderDownCorrelationArray = function() {
        self.downCorrelationArray = [];
        var sum = 0;

        for (var i = 0; i < self.correlationArray.length; i++) {
            for (var j = 0; j < self.correlationArray.length; j++) {
                sum += self.correlationArray[j][i];
            }
            self.downCorrelationArray.push(+sum.toFixed(2));
            sum = 0;
        }

    }

});

