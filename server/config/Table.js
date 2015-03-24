var Table = require('mongoose').model('Table');


exports.save = function(req, res, next) {

    if (!req.user) {
        res.status(403);
        res.end();
    }

    var newTableData = req.body;

    Table.create({
        tableName: newTableData.tableName,
        userId: req.user._id,
        wrightAnswersArray: newTableData.wrightAnswersArray,
        correlationArray: newTableData.correlationArray,
        downArray: newTableData.downArray,
        rightArray: newTableData.rightArray
    }, function(err, table) {
        if (err) {
            res.status(400);
            return res.write({reason:err.toString()})
        }
        return res.send(table);
    });

};

exports.get = function(req, res, next) {

    Table.findOne({_id:req.params.id}).exec(function(err, table) {
        if (err) {
            res.status(500);
            return res.write(err.toString());
        }
        console.log(req.params.id);
        console.log(table);
        return res.send(table);

    });

};


exports.update = function(req, res, next) {

    var newTableData = req.body;

    Table.findOne({_id:req.params.id}, function(err, table) {

        if (!table) {
            res.status(400);
            return res.send({success:false});
        }

        console.log(req.user._id, table.userId);

        if (req.user._id != table.userId) {
            res.status(403);
            return res.end();
        }
        table.wrightAnswersArray = newTableData.wrightAnswersArray;
        table.correlationArray = newTableData.correlationArray;
        table.downArray = newTableData.downArray;
        table.rightArray = newTableData.rightArray;
        table.save();
        res.send({success:true});
    });

};
