app.service('tableCheck', function(tableService) {

    var self = this;

    self.wrightAnswersArray = tableService.wrightAnswersArray;
    self.downArray = tableService.downArray;
    self.rightArray = tableService.rightArray;

    self.check = function() {

        for (i = 0; i < tableService.downArray.length; i++) {
            if (tableService.downArray[i] == 0) {
                console.log(i);
                console.log(tableService.wrightAnswersArray[0].problems[i][1], 'никто не');
            }
            if (tableService.downArray[i] == tableService.wrightAnswersArray.length) {
                console.log(tableService.wrightAnswersArray[0].problems[i][1], 'все');
            }
        }

        for (var i = 0; i < tableService.correlationArray.length; i++) {
            var arr = tableService.correlationArray[i];
            if (arr[arr.length - 1] <= 0) {
                console.log(arr[0], '!с общим');
            } else if (arr[arr.length - 1] <= 0.3) {
                console.log(arr[0], '?с общим');
            }
        }

        for (i = 0; i < tableService.downCorrelationArray.length; i++) {
            arr = tableService.downCorrelationArray;
            if (arr[i]/arr.length <= 0.3) {
                console.log(i+1, '!с другими');
            }
        }

        sortTables();

        for (i = 0; i < tableService.wrightAnswersArray.length; i++) {
            var sum = 0;
            for (var j = 0; j < tableService.wrightAnswersArray[i].problems.length; j++) {
                if (((j < i) && tableService.wrightAnswersArray[i].problems[j][0] == 0) ||
                    ((j > i) && tableService.wrightAnswersArray[i].problems[j][0] == 1)) {
                    sum++;
                    console.log(i, j);
                }
            }
            if (sum >= 4) {console.log(tableService.wrightAnswersArray[i].name); console.log(sum)}
        }
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

