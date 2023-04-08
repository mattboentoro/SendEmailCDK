const aws = require("aws-sdk");
const nodemailer = require("nodemailer");

async function sendEmail(senderEmail, senderName, message, subject, date) {
  let transporter = nodemailer.createTransport({
    SES: new aws.SES({ region: "us-west-2", apiVersion: "2010-12-01" }),
  });
  return transporter.sendMail({
      from: `${senderName} <donotreplymattboentoro@gmail.com>`,
      to: "mattboentoro@yahoo.com",
      subject: `[From MyWebsite] ${subject}`,
      text: message,
      html: generateHTML(senderEmail, senderName, message, subject, date),
  });
}

function generateHTML(senderEmail, senderName, message, subject, date) {
    return `
        <html>
            <head>
            <style> 
            * {
                font-family: sans-serif;
            }
            .title { 
                font-weight: 700;
            } 
            .message { 
                margin-top: 20px;
            }
            .title { 
                display: inline-block; width: 100px; 
            }
            .title-div {
                font-size: 16px
            }
            </style>
            </head>
            <body>
            <div class='title-div'>
                <span class='title'>👨 Sender: </span><span>${senderName} (${senderEmail})</span>
            </div>
            <div class='title-div'>
                <span class='title'>📢 Subject: </span><span>${subject}</span>
            </div>
            <div class='title-div'>
                <span class='title'>📅 Date: </span><span>${date}</span>
            </div>
            <div class='message'>${message.replace(/\n/g,'<br/>')}</div>
            </body>
        </html>
    `
}

exports.main = async (event) => {
  const { senderEmail, senderName, message, subject, date, email } = JSON.parse(
    event.body
  );

  try {
    await sendEmail(senderEmail, senderName, message, subject, date, email);
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