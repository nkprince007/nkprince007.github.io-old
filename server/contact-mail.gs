var TO_ADDRESS = "<yourmailaddress@somedomain.com>";
var WEBSITE = "<yourwebsite.com>";
var GOOGLE_RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";
var GOOGLE_RECAPTCHA_SECRET = "ADD_IN_YOUR_RECAPTCHA_SECRET_HERE";
var EXCLUDE_IN_MAIL = ['g-recaptcha-response'];

function doPost(e) {
  try {
    var recaptchaResponse = e.parameter['g-recaptcha-response'];

    if (testCaptcha(recaptchaResponse))
      return sendEmail(e);
    else
      return ContentService.createTextOutput(JSON.stringify({
        "result": "error",
        "error": "Captcha verification failed!"
      })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {

    Logger.log(error);
    return ContentService.createTextOutput(JSON.stringify({
      "result": "error",
      "error": error
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function testCaptcha(response) {
  var captcha_options = {
    'secret': GOOGLE_RECAPTCHA_SECRET,
    'response': response
  };
  var params = {
    'method': 'POST',
    'payload': captcha_options
  }

  var results = UrlFetchApp.fetch(GOOGLE_RECAPTCHA_VERIFY_URL, params);
  return JSON.parse(results.getContentText()).success;
}

function formatMailBody(obj) {
  var result = "";

  // Create a <h4 /> for key and <div /> for it's value
  for (var key in obj) {
    if (key in EXCLUDE_IN_MAIL)
      continue;
    result += "<h4 style='text-transform: capitalize; margin-bottom: 0'>" + key + "</h4><div>" + obj[key] + "</div>";
  }

  return result;
}

function sendEmail(e) {
  try {
    Logger.log(e);

    MailApp.sendEmail({
      to: TO_ADDRESS,
      subject: "Form Submission from " + WEBSITE,
      htmlBody: formatMailBody(e.parameters)
    });

    return ContentService.createTextOutput(JSON.stringify({
      "result": "success",
      "data": JSON.stringify(e.parameters)
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log(error);

    return ContentService.createTextOutput(JSON.stringify({
      "result": "error",
      "error": error
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
