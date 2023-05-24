const aws = require("aws-sdk");
const nodemailer = require("nodemailer");

async function sendEmail(senderEmail, senderName, message, subject, date, ipAddress, country, countryCode, region, time, timezone) {
  let transporter = nodemailer.createTransport({
    SES: new aws.SES({ region: "us-west-2", apiVersion: "2010-12-01" }),
  });
  return transporter.sendMail({
      from: `${senderName} <donotreplymattboentoro@gmail.com>`,
      to: "mattboentoro@yahoo.com",
      subject: `🛎️ [From MyWebsite] ${subject}`,
      text: message,
      html: generateHTML(senderEmail, senderName, message, date, ipAddress, country, countryCode, region, time, timezone),
      replyTo: senderEmail
  });
}

function getFlagEmoji(countryCode) {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char =>  127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
  }

function generateHTML(senderEmail, senderName, message, date, ipAddress, country, countryCode, region, time, timezone) {
    return `
        <html>
            <head>
            <style> 
                * {
                    font-family: sans-serif;
                    font-size: 16px;
                }
                .title { 
                    font-weight: 700;
                    
                } 
                .message { 
                    margin-top: 20px;
                }
                .title { 
                    display: inline-block; 
                    width: 30px; 

                }
                .sender-detail {
                  font-weight: 700;
                  background-color: #149ddd;
                  border-radius: 15px;
                  padding-top: 5px;
                  padding-bottom: 5px;
                  padding-left: 8px;
                  padding-right: 10px;
                  color: white;
                  display: inline-block;
                  font-size: 11px;
                  margin-right: 2px;
                  margin-bottom: 6px;
                  box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
                }
                a {
                  font-size: 11px;
                  color: white;
                  text-decoration: none;
                }
            </style>
            </head>
            <body>
                <div style="display: none; max-height: 0px; overflow: hidden;">
                    ${message.replace(/\n/g,'<br/>')}
                </div>
                <div class='title-div'>
                    <span class='sender-detail'>👨&nbsp;&nbsp;${senderName}</span>
                    <span class='sender-detail'>📨&nbsp;&nbsp;<a href = "mailto: ${senderEmail}">${senderEmail}</a></span>
                    <span class='sender-detail'>📅&nbsp;&nbsp;${date}</span>
                    <span class='sender-detail'>🕰️&nbsp;&nbsp;${time}</span>
                    <span class='sender-detail'>️⏳&nbsp;&nbsp;${timezone}</span>
                    <span class='sender-detail'>🚩&nbsp;&nbsp;${ipAddress}</span>
                    <span class='sender-detail'>📌&nbsp;&nbsp;${region}</span>
                    <span class='sender-detail'>🌏&nbsp;&nbsp;${country} ${getFlagEmoji(countryCode)}</span>
                </div>
                <div class='message'>${message.replace(/\n/g,'<br/>')}</div>
            </body>
        </html>
    `
}

exports.main = async (event) => {
  const { senderEmail, senderName, message, subject, date, ipAddress, country, countryCode, region, time, timezone } = JSON.parse(
    event.body
  );

  try {
    await sendEmail(senderEmail, senderName, message, subject, date, ipAddress, country, countryCode, region, time, timezone);
    return {
      statusCode: 200,
      message: "Email sent successfully!"
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Email not sent !"
    };
  }
};