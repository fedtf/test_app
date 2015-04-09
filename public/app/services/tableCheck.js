app.service('tableCheck', function(tableService, notifier) {

    var self = this;

    self.firstCheck = true;

    self.checkResult = {};

    self.everythingFine = false;

    self.check = function() {

        self.everythingFine = true;

        self.firstCheck = false;

        self.checkResult = {
            everybodyAnswered: [],
            nobodyAnswered: [],
            criticalCommon: [],
            candidateCommon: [],
            withOthers: [],
            guessed: []
        };

        for (i = 0; i < tableService.downArray.length-2; i++) {
            if (tableService.downArray[i] == 0) {
                self.checkResult.nobodyAnswered.push(tableService.wrightAnswersArray[0].problems[i][1]);
                self.everythingFine = false;
            }
            if (tableService.downArray[i] == tableService.wrightAnswersArray.length) {
                console.log(tableService.wrightAnswersArray[0], i);
                self.checkResult.everybodyAnswered.push(tableService.wrightAnswersArray[0].problems[i][1]);
                self.everythingFine = false;
            }
        }

        for (var i = 1; i < tableService.correlationArray.length-1; i++) {
            var arr = tableService.correlationArray[i];
            if ((arr[arr.length - 1] <= 0) &&
                self.checkResult.nobodyAnswered.indexOf(arr[0]) == -1 &&
                self.checkResult.nobodyAnswered.indexOf(arr[0]) == -1) {
                    self.checkResult.criticalCommon.push(arr[0]);
                    self.everythingFine = false;
            } else if ((arr[arr.length - 1] <= 0.3) &&
                self.checkResult.nobodyAnswered.indexOf(arr[0]) == -1 &&
                self.checkResult.nobodyAnswered.indexOf(arr[0]) == -1 &&
                self.checkResult.criticalCommon.indexOf(arr[0]) == -1) {
                self.checkResult.candidateCommon.push(arr[0]);
                self.everythingFine = false;
            }
        }

        for (i = 0; i < tableService.downCorrelationArray.length; i++) {
            arr = tableService.downCorrelationArray;
            var corrArr = tableService.correlationArray;
            if ((arr[i]/arr.length <= 0.3) &&
                self.checkResult.nobodyAnswered.indexOf(corrArr[i][0]) == -1 &&
                self.checkResult.nobodyAnswered.indexOf(corrArr[i][0]) == -1 &&
                self.checkResult.criticalCommon.indexOf(corrArr[i][0]) == -1) {
                self.checkResult.withOthers.push(corrArr[i][0]);
                self.everythingFine = false;
                if (self.checkResult.candidateCommon.indexOf(corrArr[i][0]) > -1) {
                    self.checkResult.candidateCommon.splice(self.checkResult.candidateCommon.indexOf(corrArr[i][0]), 1);
                }
            }
        }

        sortTables();

        for (i = 0; i < tableService.wrightAnswersArray.length; i++) {
            var sum = 0;
            for (var j = 0; j < tableService.wrightAnswersArray[i].problems.length; j++) {
                if (((j < i) && tableService.wrightAnswersArray[i].problems[j][0] == 0) ||
                    ((j > i) && tableService.wrightAnswersArray[i].problems[j][0] == 1)) {
                    sum++;
                }
            }
            if (sum >= 3) {
                console.log(tableService.wrightAnswersArray[i].name);
                self.checkResult.guessed.push(tableService.wrightAnswersArray[i].name);
                self.everythingFine = false;
            }
        }
        console.log(self.checkResult, self.everythingFine);
    };

    function sortTables() {

        for (var i = 0; i < tableService.wrightAnswersArray.length; i++) {

            for (var j = 0; j < tableService.wrightAnswersArray[i].problems.length; j++) {
                tableService.wrightAnswersArray[i].problems[j].push(tableService.downArray[j]);
            }

            tableService.wrightAnswersArray[i].problems.sort(function(a, b) {
                if (typeof a == 'string') return false;
                if (typeof b == 'string') return true;
                return b[2] - a[2];
            });

            for (j = 0; j < tableService.wrightAnswersArray[i].problems.length; j++) {
                tableService.wrightAnswersArray[i].problems[j].pop();
            }

            tableService.wrightAnswersArray[i].tempOrder = tableService.rightArray[i];

        }

        tableService.wrightAnswersArray.sort(function(a, b) {
            return a.tempOrder - b.tempOrder;
        });

        for (i = 0; i < tableService.wrightAnswersArray.length; i++) {
            delete tableService.wrightAnswersArray[i].tempOrder;
        }

        console.log(tableService.wrightAnswersArray);
    }

});

