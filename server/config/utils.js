var csvParse = require('csv-parse');
var fs = require('fs');
var excelParse = require('excel');
var officegen = require('officegen');
var Table = require('mongoose').model('Table');
var Docxtemplater = require('docxtemplater');
var config = require('./config');
var path = require('path');


exports.parseFile = function(req, res, next) {
    console.log(req.files.file.mimetype);

    var fileType = req.files.file.mimetype;

    if (fileType == 'text/csv') {
        parseCsvFile(req, res, next);
    } else if (fileType == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        parseExcelFile(req, res, next);
    } else {
        res.status(400);
        res.end('Неподдерживаемый тип файла');
        fs.unlink(req.files.file.path);
    }

};

exports.exportFile = function(req, res, next) {

    if (req.params.type == 'xlsx') {
        exportXlsx(req, res, next);
    } else {
        exportDocx(req, res, next);
    }
};

function parseExcelFile(req, res, next) {

    var wrightAnswersArray = [];
    var filePath = req.files.file.path;

    excelParse(filePath, function(err, data) {
        if (err) {
            res.status(500);
            res.end('Что-то пошло не так, попробуйте позже');
        }

        for (var i = 0; i < data.length; i++) {
            for(var j = 1; j < data[i].length; j++) {
                data[i][j] = [+data[i][j], j];
            }
            wrightAnswersArray.push({name: data[i][0], problems:data[i].splice(1)});
        }

        res.send({wrightAnswersArray:wrightAnswersArray});

        console.log(wrightAnswersArray);

        fs.unlink(filePath);

    })

};

function parseCsvFile(req, res, next) {

    var parser = csvParse({delimiter: ';'});
    var wrightAnswersArray = [];
    var filePath = req.files.file.path;

    parser.on('readable', function() {
        while(record = parser.read()) {
            var problems = record.splice(1);
            for (var i = 0; i < problems.length; i++) {
                problems[i] = [+problems[i], i+1];
            }
            wrightAnswersArray.push({name:record[0], problems:problems});

        }
    });
    parser.on('finish', function() {
        console.log(wrightAnswersArray);
        res.send({wrightAnswersArray:wrightAnswersArray});
        parser.end();
        fs.unlink(filePath);
    });

    var stream = fs.createReadStream(filePath);

    stream.pipe(parser);
}

function exportDocx(req, res, next) {


    console.log(req.params);
    var table = JSON.parse(req.params.table);


        var content = fs.readFileSync('templates/template.docx', 'binary');

        var doc = new Docxtemplater(content);

        doc.setData({
            title: table.tableName,
            wrightAnswersArray: table.wrightAnswersArray
        });

        doc.render();

        var buf = doc.getZip().generate({type:'nodebuffer'});

        fs.writeFileSync('out.docx', buf);

        res.send({success:true});
}

function exportXlsx(req, res, next) {

    console.log(req.params.table);

    var table = JSON.parse(req.params.table);



        var xlsx = officegen('xlsx'),
        currentRow = 0,
        currentCol = 1;

        xlsx.on('finalize', function() { console.log('finished')});
        xlsx.on('error', function(err) {console.log(err)});

        sheet = xlsx.makeNewSheet();
        sheet.name = table.tableName;
        sheet.data[currentRow] = [];


        for (i = 0; i < table.wrightAnswersArray[0].problems.length; i++) {
            sheet.data[currentRow][currentCol] = table.wrightAnswersArray[0].problems[i][1];
            currentCol++;
        }

        sheet.data[currentRow][currentCol] = 'Сумма';
        sheet.data[currentRow][currentCol+1] = 'Сумма^2';


        currentRow++;

        for (var i = 0; i < table.wrightAnswersArray.length; i++) {
            sheet.data[currentRow] = [];
            sheet.data[currentRow][0] = table.wrightAnswersArray[i].name;
            currentCol = 1;
            var problems = table.wrightAnswersArray[i].problems;
            for (var j = 0; j < problems.length; j++) {
                sheet.data[currentRow][currentCol] = problems[j][0];
                currentCol++;
            }
            sheet.data[currentRow][currentCol] = '=СУММ(' + getCellByIndex(1, currentRow) + ':'+ getCellByIndex(currentCol-1, currentRow) + ')';
            sheet.data[currentRow][currentCol+1] = '=СУММ(' + getCellByIndex(1, currentRow) + ':'+ getCellByIndex(currentCol-1, currentRow) + ')^2';
            currentRow++;
        }


        sheet.data[currentRow] = [];
        sheet.data[currentRow][0] = 'Количество решенных';
        sheet.data[currentRow+1] = [];
        sheet.data[currentRow+1][0] = 'Количество нерешенных';
        sheet.data[currentRow+2] = [];
        sheet.data[currentRow+2][0] = 'Доля решенных';
        sheet.data[currentRow+3] = [];
        sheet.data[currentRow+3][0] = 'Доля нерешенных';
        sheet.data[currentRow+4] = [];
        sheet.data[currentRow+4][0] = 'Дисперсия';
        sheet.data[currentRow+5] = [];
        sheet.data[currentRow+5][0] = 'Отклонение';
        for (i = 1; i < table.wrightAnswersArray[0].problems.length+1; i++) {
            var interval = getCellByIndex(i, 1) + ':' + getCellByIndex(i, currentRow-1);

            sheet.data[currentRow][i] = '=СУММ(' + interval +')';
            sheet.data[currentRow+1][i] = '=СЧЕТ(' + interval + ')-СУММ(' + interval +')';
            sheet.data[currentRow+2][i] = '=СУММ(' + interval +')/СЧЕТ(' + interval + ')';
            sheet.data[currentRow+3][i] = '=1-СУММ(' + interval +')/СЧЕТ(' + interval + ')';
            sheet.data[currentRow+4][i] = '=(1-СУММ(' + interval +')/СЧЕТ(' + interval + '))*СУММ(' + interval +')/СЧЕТ(' + interval + ')';
            sheet.data[currentRow+5][i] = '=КОРЕНЬ((1-СУММ(' + interval +')/СЧЕТ(' + interval + '))*(СУММ(' + interval +')/СЧЕТ(' + interval + ')))';
        }

        currentRow += 8;
        currentCol = 1;
        sheet.data[currentRow] = [];

        for (i = 0; i < table.correlationArray.length; i++) {
            sheet.data[currentRow][currentCol] = table.correlationArray[i][0];
            currentCol++;
        }

        currentRow++;

        var correlationBegin = currentRow;

        for (i = 0; i < table.correlationArray.length-1; i++) {
            sheet.data[currentRow] = [];
            currentCol = 0;
            for (j = 0; j < table.correlationArray[i].length; j++) {
                sheet.data[currentRow][currentCol] = table.correlationArray[i][j];
                currentCol++;
            }
            currentRow++;
        }

        sheet.data[currentRow] = [];
        sheet.data[currentRow][0] = 'Сумма';
        sheet.data[currentRow+1] = [];
        sheet.data[currentRow+1][0] = 'Среднее';
        sheet.data[currentRow+2] = [];
        sheet.data[currentRow+2][0] = 'Среднее^2';
        currentCol = 1;

        for (i = 0; i < table.correlationArray.length-1; i++) {
            interval = getCellByIndex(currentCol, correlationBegin) + ':' + getCellByIndex(currentCol, currentRow-1)
            sheet.data[currentRow][currentCol] = '=СУММ(' + interval + ')';
            var average = sheet.data[currentRow+1][currentCol] = '=СУММ(' + interval + ')/СЧЕТ(' + interval + ')';
            sheet.data[currentRow+2][currentCol] = average + '^2';
            currentCol++;
        }

        var filePath = path.join(config.rootDirname, 'temp_export', table.tableName + '.xlsx');

        var out = fs.createWriteStream(filePath);
        console.log(filePath);

        out.on('error', function(err) {
            console.log(err);
        });

        xlsx.generate(out);

        out.on('finish', function() {
            res.download(filePath, table.tableName + '.xlsx', function(err) {
                if (err) next(err);
                fs.unlink(filePath);
            });
        });


    function getCellByIndex(col, row) {
        var cell = '';

        do {
            cell = String.fromCharCode(col % 26 + 65) + cell;
            col = Math.floor(col/26)-1;
        } while (col >= 0);

        cell += +row + 1;

        return cell;
    }

}