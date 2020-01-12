var mainSpreadsheet = "";

var barcode = "";
var studentIndex = [0, 0];

function checkVolunteer(inOut, barVal) {
    getSheetValues(inOut);
}

function getSheetValues(inOut) {
    var r = response.result.values;
    for (var i = 0; i < r.length; i++) {
        for (var j = 0; j < r.length; j++) {
            if (r[i][j] == barcode) {
                studentIndex[0] = i;
                studentIndex[1] = j;
            }
        }
    }
    updateAttendance(inOut, r);
}

function updateAttendance(inOut, values) {

    var upRange = "";
    var rowUpdate = [];

    //TODO
    if (inOut) {
    range = "A" + studentIndex[0];
    } else {
    range = "B" + studentIndex[0];
    }
    
    //make rowUpdate with null everywhere except for match on index
    // old value + or - one based on inOut

    var params = {
    spreadsheetId: mainSpreadsheet,
    range: upRange,
    valueInputOption: '',
    };

    var valueRangeBody = {
    "range": "Sheet1!" + (letterRange + "" + 1),
    "majorDimension": "COLUMNS",
    "values": [rowUpdate]
    };

    var request = gapi.client.sheets.spreadsheets.values.update(params, valueRangeBody);
    request.then(function(response) {
    console.log(response.result);
    
    updateStudentPage();
    }, function(reason) {
    console.error('error: ' + reason.result.error.message);
    });
}

function updateStudentPage() {

}

function initClient() {
    var API_KEY = ''; 

    var CLIENT_ID = '';

    // TODO: Authorize using one of the following scopes:
    //   'https://www.googleapis.com/auth/drive'
    //   'https://www.googleapis.com/auth/drive.file'
    //   'https://www.googleapis.com/auth/spreadsheets'
    var SCOPE = '';

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