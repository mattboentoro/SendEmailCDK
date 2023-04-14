const aws = require("aws-sdk");
const nodemailer = require("nodemailer");

async function sendEmail(senderEmail, senderName, message, subject, date, ipAddress, country, countryCode, region) {
  let transporter = nodemailer.createTransport({
    SES: new aws.SES({ region: "us-west-2", apiVersion: "2010-12-01" }),
  });
  return transporter.sendMail({
      from: `${senderName} <donotreplymattboentoro@gmail.com>`,
      to: "mattboentoro@yahoo.com",
      subject: `🛎️ [From MyWebsite] ${subject}`,
      text: message,
      html: generateHTML(senderEmail, senderName, message, date, ipAddress, country, countryCode, region),
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

function generateHTML(senderEmail, senderName, message, date, ipAddress, country, countryCode, region) {
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
                    display: inline-block; width: 30px; 
                }
                .sender-detail {
                font-weight: 700;
                }
            </style>
            </head>
            <body>
                <div style="display: none; max-height: 0px; overflow: hidden;">
                    ${message.replace(/\n/g,'<br/>')}
                </div>
                <div class='title-div'>
                    <span class='title'>👨 </span><span class='sender-detail'>${senderName} (<a href = "mailto: ${senderEmail}">${senderEmail}</a>)</span>
                </div>
                <div class='title-div'>
                    <span class='title'>📅 </span><span class='sender-detail'>${date}</span>
                </div>
                <div class='title-div'>
                    <span class='title'>🚩 </span><span class='sender-detail'>${ipAddress}</span>
                </div>
                <div class='title-div'>
                    <span class='title'>📌 </span><span class='sender-detail'>${region}</span>
                </div>
                <div class='title-div'>
                    <span class='title'>🌏 </span><span class='sender-detail'>${country} ${getFlagEmoji(countryCode)}</span>
                </div>
                <div class='message'>${message.replace(/\n/g,'<br/>')}</div>
            </body>
        </html>
    `
}

exports.main = async (event) => {
  const { senderEmail, senderName, message, subject, date, ipAddress, country, countryCode, region } = JSON.parse(
    event.body
  );

  try {
    await sendEmail(senderEmail, senderName, message, subject, date, ipAddress, country, countryCode, region);
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