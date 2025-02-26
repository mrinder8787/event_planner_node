require('dotenv').config();
const { google } = require('googleapis');
var https = require('follow-redirects').https;
const serviceAccount = require("../Services/notificationService.json")

exports.gstCalculater = async (req, res) => {
    const { originalAmount, gstRate, transactionType } = req.body;
  
    try {
      if (!originalAmount || !gstRate || !transactionType) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const amount = parseFloat(originalAmount);
      const rate = parseFloat(gstRate);
  
      if (isNaN(amount) || isNaN(rate)) {
        return res.status(400).json({ error: 'Invalid numeric values' });
      }
  
      const gstAmount = (amount * rate) / 100;
      let cgst = 0, sgst = 0, igst = 0;
  
      if (transactionType === 'Intra-State') {
        cgst = gstAmount / 2;
        sgst = gstAmount / 2;
      } else if (transactionType === 'Inter-State') {
        igst = gstAmount;
      } else {
        return res.status(400).json({ error: 'Invalid transaction type' });
      }
  
      const totalAmount = amount + gstAmount;
      const totalWithoutGst = amount - gstAmount;
      console.log("Total Amount", totalAmount);
  
      return res.status(200).json({
        error: false,
        message: "GST Calculated",
        originalAmount: amount,
        gstRate: rate,
        transactionType,
        gstAmount,
        cgst,
        sgst,
        igst,
        totalAmount,
        totalWithoutGst
      });
    } catch (e) {
      return res.status(500).json({
        error: true,
        message: e.message,
      });
    }
  };
  

async function getAccessToken() {
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: [
      "https://www.googleapis.com/auth/firebase.messaging",
      "https://www.googleapis.com/auth/cloud-platform",
    ],
  });

  const accessTokenResponse = await auth.getAccessToken();
  return accessTokenResponse.token || accessTokenResponse;
}



exports.sendNotification = async (req, res) => {
  const { token, title, body, route } = req.body;
  const accessTokenResponse = await getAccessToken();
  var options = {
    'method': 'POST',
    'hostname': 'fcm.googleapis.com',
    'path': '/v1/projects/eventplanner-f7fb5/messages:send',
    'headers': {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessTokenResponse}`
    },
    'maxRedirects': 20
  };

  var reqFCM = https.request(options, function (fcmRes) {
    var chunks = [];

    fcmRes.on("data", function (chunk) {
      chunks.push(chunk);
    });

    fcmRes.on("end", function () {
      var body = Buffer.concat(chunks);
    
      console.log(body.toString());

      
      res.status(fcmRes.statusCode).send({
        error:false,
        message:"Notification sende",
        data:body.toString()
      });
    });

    fcmRes.on("error", function (error) {
      console.error(error);
      res.status(500).send({ error: 'Error while sending notification' });
    });
  });

  var postData = JSON.stringify({
    "message": {
      "token": token,
      "notification": {
        "title": title,
        "body": body
      },
      "data": {
        "route": route
      }
    }
  });

  reqFCM.write(postData);
  reqFCM.end();
};






