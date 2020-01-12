//TODO
//-check out functionality (add html toggle)
//on promise return info render


var sheetLetterrs = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ'];

function checkStudent(barNum) {

    var date = new Date;
    date.setTime(date.getTime());
    var minutes = date.getMinutes();
    var hour = date.getHours();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear() - 2000;
    var currentTime = hour + ":" + minutes;
    var currentDate =  month + "/" + day + "/" + year;
    locateStudent(barNum, 0, currentTime, currentDate);
    console.log(currentTime);
    console.log(currentDate);
}

function locateStudent(barNum, column, currentTime, currentDate) {
    var params = {
      spreadsheetId: '17GHPrictxASzfodpFt8NZosMHElYgan4BcQV3eva9rQ',
      range: 'Sheet1',
      majorDimension: 'ROWS',
      valueRenderOption: 'FORMATTED_VALUE',
      dateTimeRenderOption: 'FORMATTED_STRING',
    };

    var request = gapi.client.sheets.spreadsheets.values.get(params);
    request.then(function(response) {
        var r = response.result.values;

        var ct = 0;
        r.forEach(element => {
            if (element[0] == barNum) {
                console.log("we gotchu " + element[1]);
                setTime(barNum, ct, r, column, currentTime, currentDate);
            }
            ct++;
        });
        console.log(response.result);
    }, function(reason) {
        console.error('error: ' + reason.result.error.message);
    });
}

function setTime(barNum, volunteerIndex, r, column, currentTime, currentDate) {
    for (var i = 5; i < r[0].length; i++) {
        if (r[0][i] == currentDate) {
            var dateLocation = sheetLetterrs[i + column];
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

    var request = gapi.client.sheets.spreadsheets.values.update(params, valueRangeBody);
    request.then(function(response) {
    console.log('checked in');
    document.getElementById("personName").innerHTML = r[volunteerIndex][1];
    document.getElementById("personRoom").innerHTML = "Room: " + r[volunteerIndex][2];
    document.getElementById("personGrade").innerHTML = "Grade: " + r[volunteerIndex][3];
    document.getElementById("confPage").style.display = "block";
    document.getElementById("confPage").style.opacity = 1;
    
    setTimeout(
    function(){
        document.getElementById("confPage").style.opacity = 0;
        setTimeout(function(){document.getElementById("confPage").style.display = "none";}, 1000);
    }, 2000);

    console.log(response.result);
    }, function(reason) {
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
    }).then(function() {
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
