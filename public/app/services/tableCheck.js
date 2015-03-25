app.service('tableCheck', function(tableService) {

    var self = this;

    self.wrightAnswersArray = tableService.wrightAnswersArray;
    self.downArray = tableService.downArray;
    self.rightArray = tableService.rightArray;

    self.check = function() {

        for (var i = 0; i < tableService.wrightAnswersArray.length; i++) {

            for (var j = 1; j < tableService.wrightAnswersArray[i].length; j++) {
                tableService.wrightAnswersArray[i][j].push(tableService.downArray[j-1]);
            }

            tableService.wrightAnswersArray[i].sort(function(a, b) {
                if (typeof a == 'string') return false;
                if (typeof b == 'string') return true;
                return b[2] - a[2];
            });

            for (j = 1; j < tableService.wrightAnswersArray[i].length; j++) {
                tableService.wrightAnswersArray[i][j].pop();
            }

            tableService.wrightAnswersArray[i].push(tableService.rightArray[i]);

        }

        tableService.wrightAnswersArray.sort(function(a, b) {
            return a[a.length-1] - b[b.length-1];
        });

        for (var i = 0; i < tableService.wrightAnswersArray.length; i++) {
            tableService.wrightAnswersArray[i].pop();
        }

        console.log(tableService.wrightAnswersArray);

    }

});