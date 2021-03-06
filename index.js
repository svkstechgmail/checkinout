//Last update Feb 15
//TODO
//on promise return info render

var sheetLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ'];
//var lbTime = [0, 5400, 7800, 7860];
//var ubTime = [5400, 7800, 7860, 10000];
//var newTime = [5400,];

//Gets barcode number, processes time and date
function checkStudent(barNum, num) { // add boolean as param for checking in or checking out
    var date = new Date;
    date.setTime(date.getTime());
    var minutes = date.getMinutes();
    var hour = date.getHours();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear() - 2000;
    var currentTime;

    //CHANGE HOUR AND MINUTES ACCORDINGLY
    //Check in
    if (num == 1) {
        //9:01 ~ 9:15 ==> 9:15
        //Otherwise to nearest 15
        if (hour == 9 && (1 <= minutes && minutes <= 15)) {
            minutes = 15;
        } else {
            var newMinute;
            //To 15
            if (8 <= minutes && minutes < 23) {
                newMinute = 15;
            }
            //To 30
            else if (23 <= minutes && minutes < 38) {
                newMinute = 30;
            }
            //To 45
            else if (38 <= minutes && minutes < 53) {
                newMinute = 45;
            }
            //To 0
            else if (minutes < 8) {
                newMinute = 0;
            }
            else {
                newMinute = 0;
                hour++;
            }
            minutes = newMinute;
        }
    }
    //Check out
    else {
        //13:01 ~ 13:15 ==> 13:15
        //12:25 ~ 12:59 ==> 13:00
        //Otherwise nearest 15
        if (hour == 13 && (1 <= minutes && minutes <= 15)) {
            minutes = 15;
        } else if (hour == 12 && (25 <= minutes && minutes <= 59)) {
            hour = 13;
            minutes = 0;
        } else {
            var newMinute;
            //To 15
            if (8 <= minutes && minutes < 23) {
                newMinute = 15;
            }
            //To 30
            else if (23 <= minutes && minutes < 38) {
                newMinute = 30;
            }
            //To 45
            else if (38 <= minutes && minutes < 53) {
                newMinute = 45;
            }
            //To 0
            else if (minutes < 8) {
                newMinute = 0;
            }
            else {
                newMinute = 0;
                hour++;
            }
            minutes = newMinute;
        }
    }
    //Done changing hours and minutes

    //Format time
    if (minutes <= 9) {
        currentTime = hour + ":0" + minutes;
    } else {
        currentTime = hour + ":" + minutes;
    }
    var currentDate = month + "/" + day + "/" + year;
    locateStudent(barNum, 0, currentTime, currentDate, num);
    console.log(currentTime);
    console.log(currentDate);
}

function locateStudent(barNum, column, currentTime, currentDate, num) {
    var params = {
        spreadsheetId: '17GHPrictxASzfodpFt8NZosMHElYgan4BcQV3eva9rQ',
        range: 'Sheet1',
        majorDimension: 'ROWS',
        valueRenderOption: 'FORMATTED_VALUE',
        dateTimeRenderOption: 'FORMATTED_STRING',
    };

    var request = gapi.client.sheets.spreadsheets.values.get(params);
    request.then(function (response) {
        var r = response.result.values;

        //Looks for student
        var ct = 0;
        r.forEach(element => {
            if (element[0] == barNum) {
                console.log("we gotchu " + element[1]);
                //Write to the sheet
                if (num == 0) {
                    column++;
                }
                setTime(barNum, ct, r, column, currentTime, currentDate);
            }
            ct++;
        });
        console.log(response.result);
    }, function (reason) {
        console.error('error: ' + reason.result.error.message);
    });
}

//Writes to the sheet
function setTime(barNum, volunteerIndex, r, column, currentTime, currentDate) {
    for (var i = 5; i < r[0].length; i++) {
        if (r[0][i] == currentDate) {
            var dateLocation = sheetLetters[i + column];
            break;
        }
    }
    //console.log(dateLocation + (volunteerIndex + 1));
    var params = {
        spreadsheetId: '17GHPrictxASzfodpFt8NZosMHElYgan4BcQV3eva9rQ',
        range: dateLocation + (volunteerIndex + 1),
        valueInputOption: 'USER_ENTERED',
    };
    var valueRangeBody = {
        "range": dateLocation + (volunteerIndex + 1),
        "values": [
            [currentTime]
        ],
        "majorDimension": "ROWS"
    };

    //Gets params and value, then update the sheet
    var request = gapi.client.sheets.spreadsheets.values.update(params, valueRangeBody);
    request.then(function (response) {
        console.log('checked in');
        document.getElementById("personName").innerHTML = r[volunteerIndex][1];
        document.getElementById("personRoom").innerHTML = "Room: " + r[volunteerIndex][2];
        document.getElementById("personGrade").innerHTML = "Grade: " + r[volunteerIndex][3];
        document.getElementById("confPage").style.display = "block";
        document.getElementById("confPage").style.opacity = 1;

        setTimeout(
            function () {
                document.getElementById("confPage").style.opacity = 0;
                setTimeout(function () { document.getElementById("confPage").style.display = "none"; }, 1000);
            }, 2000);

        console.log(response.result);
    }, function (reason) {
        console.error('error: ' + reason.result.error.message);
    });
}

function initClient() {
    var API_KEY = 'AIzaSyDS4ofVYE15B9bzoiRJYb_quQpnnFysXiY';
    var CLIENT_ID = '953406426507-cjfp7irm5cqdsit6dgg0ricvogigv7i0.apps.googleusercontent.com';
    var SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

    gapi.client.init({
        'apiKey': API_KEY,
        'clientId': CLIENT_ID,
        'scope': SCOPE,
        'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
    }).then(function () {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
        updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function updateSignInStatus(isSignedIn) {
    if (isSignedIn) {
        //makeApiCall();
    }
}

function handleSignInClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

var _scannerIsRunning = false;

//Scans barcode
function startScanner(num) {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#scanner-container'),
            constraints: {
                width: window.innerWidth,
                height: window.innerHeight,
                facingMode: "environment"
            },
        },
        decoder: {
            readers: [
                "code_128_reader",
                "ean_reader",
                "ean_8_reader",
                "code_39_reader",
                "code_39_vin_reader",
                "codabar_reader",
                "upc_reader",
                "upc_e_reader",
                "i2of5_reader"
            ],
            debug: {
                showCanvas: false,
                showPatches: true,
                showFoundPatches: true,
                showSkeleton: true,
                showLabels: true,
                showPatchLabels: true,
                showRemainingPatchLabels: true,
                boxFromPatches: {
                    showTransformed: true,
                    showTransformedBox: true,
                    showBB: true
                }
            }
        },

    }, function (err) {
        if (err) {
            console.log(err);
            return
        }

        console.log("Initialization finished. Ready to start");
        Quagga.start();

        // Set flag to is running
        _scannerIsRunning = true;

    });

    // Quagga.onProcessed(function (result) {
    //     Quagga.canvas.ctx.overlay.style.display = "none";
    // });

    Quagga.onProcessed(function (result) {
        drawOnCanvas();
        var drawingCtx = Quagga.canvas.ctx.overlay,
            drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box) {
                    return box !== result.box;
                }).forEach(function (box) {
                    Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
                });
            }

            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
            }

            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
            }
        }
    });

    //Found the barcode
    Quagga.onDetected(function (result) {
        console.log("Barcode detected and processed : [" + result.codeResult.code + "]", result);
        checkStudent(result.codeResult.code, num);
        _scannerIsRunning = false;
        Quagga.stop();
        setTimeout(startScanner, 3000);
        console.log("hellooooo");
    });
}

//Gray box
function drawOnCanvas() {
    console.log("drawingOnCanvas");
    var canvas = document.getElementById("barcodeArea");
    var ctx = canvas.getContext("2d");
    ctx.canvas.width = window.innerWidth;
    var h = document.getElementsByClassName("drawingBuffer")[0].clientHeight;
    ctx.canvas.height = h;
    ctx.fillStyle = "#AAAAAA55";
    ctx.fillRect(200, 300, window.innerWidth - 400, h - 600);
}


function scanBarcode(num) {
    if (_scannerIsRunning) {
        Quagga.stop();
    } else {
        startScanner(num);
    }
}

// // Start/stop scanner
// document.getElementById("btn").addEventListener("click", function () {

// }, false);

//Order of function calls:
//startScanner
//checkStudent
//locatestudent
//settime