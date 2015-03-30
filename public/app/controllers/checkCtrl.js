app.controller('checkCtrl', function(tableCheck, tableService, $element){
    var ch = this;
    ch.val = 'HEY CHECK';
    ch.hidden = true;
    console.log(ch);

    ch.checkResult = tableCheck.checkResult;

    ch.showCheckDiv = function() {
        $element.animate({
            left: 0
        });
        ch.hidden = false;
    };

    ch.hideCheckDiv = function() {
        $element.animate({
            left: '-12%'
        });
        ch.hidden = true;
    }

});