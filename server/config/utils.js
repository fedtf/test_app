var csvParse = require('csv-parse');
var fs = require('fs');
var officegen = require('officegen');
var Table = require('mongoose').model('Table');
var Docxtemplater = require('docxtemplater');
var config = require('./config');
var path = require('path');
var xlsx = require('node-xlsx');

exports.parseFile = function(req, res, next) {
    console.log(req.files.file.mimetype);

    var fileType = req.files.file.mimetype;

    if (fileType == 'text/csv' || fileType == 'application/vnd.ms-excel') {
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

    var xlsxObj = xlsx.parse(filePath);
    var data = xlsxObj[0].data;

        for (var i = 0; i < data.length; i++) {
            for(var j = 1; j < data[i].length; j++) {
                data[i][j] = [+data[i][j], j];
                console.log(data[i][j]);
            }
            wrightAnswersArray.push({name: data[i][0], problems:data[i].splice(1)});
            console.log({name: data[i][0], problems:data[i]});
        }

        res.send({wrightAnswersArray:wrightAnswersArray});

    fs.unlink(filePath);

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

    var table = JSON.parse(req.params.table);

    var content = fs.readFileSync('templates/template.docx', 'binary');
    var doc = new Docxtemplater(content);

    var tableXml = '<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:w="5000" w:type="pct"/>' +
        '<w:tblBorders>' +
        '<w:top w:val="single" w:sz="12" w:space="0" w:color="000000" />' +
        '<w:start w:val="single" w:sz="24" w:space="0" w:color="000000" />' +
        '<w:bottom w:val="single" w:sz="12" w:space="0" w:color="000000" />' +
        '<w:end w:val="single" w:sz="24" w:space="0" w:color="000000" />' +
        '<w:insideH w:val="single" w:sz="24" w:space="0" w:color="000000" />' +
        '<w:insideV w:val="single" w:sz="24" w:space="0" w:color="000000" />' +
        '</w:tblBorders>' +
        '</w:tblPr><w:tblGrid>';

    for (var i = 0; i < table.wrightAnswersArray[0].problems.length+3; i++) {
        tableXml += '<w:gridCol w:w="2880"/>';
    }

    tableXml += '</w:tblGrid>';

    tableXml += '<w:tr>';
    tableXml += getCell('');
    for (var i = 0; i < table.wrightAnswersArray[0].problems.length; i++) {
        tableXml += getCell(table.wrightAnswersArray[0].problems[i][1]);
    }
    tableXml += getCell('Сумма');
    tableXml += getCell('Сумма^2');
    tableXml += '</w:tr>';

    for (i = 0; i < table.wrightAnswersArray.length; i++) {
        tableXml += '<w:tr>' + getCell(table.wrightAnswersArray[i].name);
            console.log(table.wrightAnswersArray[i].name);
        for (var j = 0; j < table.wrightAnswersArray[i].problems.length; j++) {
            tableXml += getCell(table.wrightAnswersArray[i].problems[j][0]);
        }
        tableXml += getCell(table.rightArray[i]);
        tableXml += getCell(Math.pow(table.rightArray[i], 2));
        tableXml += '</w:tr>';
    }

    tableXml += '<w:tr>';
    tableXml += getCell('Количество решивших');

    for (i = 0; i < table.wrightAnswersArray[0].problems.length; i++) {
        tableXml += getCell(table.downArray[i])
    }
    tableXml += getCell('');
    tableXml += getCell('');
    tableXml += '</w:tr>';

    tableXml += '<w:tr>';
    tableXml += getCell('Количество нерешивших');

    for (i = 0; i < table.wrightAnswersArray[0].problems.length; i++) {
        tableXml += getCell(table.wrightAnswersArray.length - table.downArray[i]);
    }
    tableXml += getCell('');
    tableXml += getCell('');
    tableXml += '</w:tr>';

    tableXml += '<w:tr>';
    tableXml += getCell('Доля решивших');

    for (i = 0; i < table.wrightAnswersArray[0].problems.length; i++) {
        tableXml += getCell((table.downArray[i]/table.wrightAnswersArray.length).toFixed(3));
    }
    tableXml += getCell('');
    tableXml += getCell('');
    tableXml += '</w:tr>';

    tableXml += '<w:tr>';
    tableXml += getCell('Доля нерешивших');

    for (i = 0; i < table.wrightAnswersArray[0].problems.length; i++) {
        tableXml += getCell((1-table.downArray[i]/table.wrightAnswersArray.length).toFixed(3))
    }
    tableXml += getCell('');
    tableXml += getCell('');
    tableXml += '</w:tr>';

    tableXml += '<w:tr>';
    tableXml += getCell('Дисперсия');

    for (i = 0; i < table.wrightAnswersArray[0].problems.length; i++) {
        tableXml += getCell(((table.downArray[i]/table.wrightAnswersArray.length)
            *(1-table.downArray[i]/table.wrightAnswersArray.length)).toFixed(3));
    }
    tableXml += getCell('');
    tableXml += getCell('');
    tableXml += '</w:tr>';

    tableXml += '<w:tr>';
    tableXml += getCell('Отклонение');

    for (i = 0; i < table.wrightAnswersArray[0].problems.length; i++) {
        tableXml += getCell(Math.sqrt(((table.downArray[i]/table.wrightAnswersArray.length)
            *(1-table.downArray[i]/table.wrightAnswersArray.length))).toFixed(3));
    }
    tableXml += getCell('');
    tableXml += getCell('');
    tableXml += '</w:tr>';

    tableXml += '</w:tbl>';

    var corrXml = '<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:w="5000" w:type="pct"/></w:tblPr><w:tblGrid>';

    for (i = 0; i < table.correlationArray[0].length; i++) {
        corrXml += '<w:gridCol w:w="2880"/>';
    }

    corrXml += '</w:tblGrid>';

    corrXml += '<w:tr>';
    corrXml += getCell('');
    for (i = 0; i < table.correlationArray.length; i++) {
        corrXml += getCell(table.correlationArray[i][0]);
    }
    corrXml += '</w:tr>';

    for (i = 0; i < table.correlationArray.length-1; i++) {
        corrXml += '<w:tr>';
        for (j = 0; j < table.correlationArray[i].length; j++) {
            corrXml += getCell(table.correlationArray[i][j])
        }
        corrXml += '</w:tr>';
    }

    corrXml += '<w:tr>';
    corrXml += getCell('Сумма');

    var downCorr = getDownCorrelationArray(table.correlationArray);

    for (i = 0; i < downCorr.length; i++) {
        corrXml += getCell(downCorr[i]);
    }

    corrXml += getCell('');

    corrXml += '</w:tr>';

    corrXml += '<w:tr>';
    corrXml += getCell('Среднее');

    for (i = 0; i < downCorr.length; i++) {
        corrXml += getCell((downCorr[i]/table.correlationArray.length).toFixed(3));
    }
    corrXml += getCell('');
    corrXml += '</w:tr>';

    corrXml += '<w:tr>';
    corrXml += getCell('Среднее^2');

    for (i = 0; i < downCorr.length; i++) {
        corrXml += getCell(Math.pow(downCorr[i]/table.correlationArray.length,2).toFixed(4));
    }
    corrXml += getCell('');
    corrXml += '</w:tr>';
    corrXml += '</w:tbl>';

    doc.setData({
        title: table.tableName,
        xmlTable: tableXml,
        xmlCorr: corrXml
    });

    doc.render();

    var buf = doc.getZip().generate({type:'nodebuffer'});

    var filePath = path.join(config.rootDirname, 'temp_export', table.tableName + '.docx');

    fs.writeFileSync(filePath, buf);

    res.download(filePath, table.tableName + '.docx', function(err) {
        if (err) next(err);
        fs.unlink(filePath);
    });

    function getCell(val) {
        return '<w:tc><w:tcPr><w:tcW w:type="dxa"/></w:tcPr><w:p><w:r><w:t>' + val + '</w:t></w:r></w:p></w:tc>';
    }
}

function exportXlsx(req, res, next) {

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
            //sheet.data[currentRow][currentCol] = '=СУММ(' + getCellByIndex(1, currentRow) + ':'+ getCellByIndex(currentCol-1, currentRow) + ')';
            //sheet.data[currentRow][currentCol+1] = '=СУММ(' + getCellByIndex(1, currentRow) + ':'+ getCellByIndex(currentCol-1, currentRow) + ')^2';
            sheet.data[currentRow][currentCol] = table.rightArray[i];
            sheet.data[currentRow][currentCol+1] = Math.pow(table.rightArray[i], 2);
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
            //var interval = getCellByIndex(i, 1) + ':' + getCellByIndex(i, currentRow-1);

            /*sheet.data[currentRow][i] = '=СУММ(' + interval +')';
            sheet.data[currentRow+1][i] = '=СЧЕТ(' + interval + ')-СУММ(' + interval +')';
            sheet.data[currentRow+2][i] = '=СУММ(' + interval +')/СЧЕТ(' + interval + ')';
            sheet.data[currentRow+3][i] = '=1-СУММ(' + interval +')/СЧЕТ(' + interval + ')';
            sheet.data[currentRow+4][i] = '=(1-СУММ(' + interval +')/СЧЕТ(' + interval + '))*СУММ(' + interval +')/СЧЕТ(' + interval + ')';
            sheet.data[currentRow+5][i] = '=КОРЕНЬ((1-СУММ(' + interval +')/СЧЕТ(' + interval + '))*(СУММ(' + interval +')/СЧЕТ(' + interval + ')))';*/
            var val = table.downArray[i-1];
            sheet.data[currentRow][i] = val;
            sheet.data[currentRow+1][i] = table.wrightAnswersArray.length - val;
            sheet.data[currentRow+2][i] = (val/table.wrightAnswersArray.length).toFixed(3);
            sheet.data[currentRow+3][i] = (1 - val/table.wrightAnswersArray.length).toFixed(3);
            sheet.data[currentRow+4][i] = ((1 - val/table.wrightAnswersArray.length)*
                (val/table.wrightAnswersArray.length)).toFixed(3);
            sheet.data[currentRow+5][i] = Math.sqrt((1 - val/table.wrightAnswersArray.length)*
                (val/table.wrightAnswersArray.length)).toFixed(4);
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

        var downCorr = getDownCorrelationArray(table.correlationArray);

        console.log(downCorr);

        for (i = 0; i < table.correlationArray.length-1; i++) {
            /*interval = getCellByIndex(currentCol, correlationBegin) + ':' + getCellByIndex(currentCol, currentRow-1)
            sheet.data[currentRow][currentCol] = '=СУММ(' + interval + ')';
            var average = sheet.data[currentRow+1][currentCol] = '=СУММ(' + interval + ')/СЧЕТ(' + interval + ')';
            sheet.data[currentRow+2][currentCol] = average + '^2';*/

            sheet.data[currentRow][currentCol] = downCorr[i];
            var average = sheet.data[currentRow+1][currentCol] = (downCorr[i]/table.correlationArray.length).toFixed(3);
            sheet.data[currentRow+2][currentCol] = Math.pow(downCorr[i]/table.correlationArray.length, 2).toFixed(4);
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

function getDownCorrelationArray(correlationArray) {
    var downCorr = [];
    for (i = 1; i < correlationArray.length; i++) {
        var sum = 0;
        for (j = 0; j < correlationArray[i].length-2; j++) {
            sum += correlationArray[j][i];
        }
        sum = sum.toFixed(2);
        console.log(sum);
        downCorr.push(sum);
    }
    return downCorr;
}