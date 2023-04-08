const aws = require("aws-sdk");
const nodemailer = require("nodemailer");

async function sendEmail(senderEmail, senderName, message, subject, date, email) {
  let transporter = nodemailer.createTransport({
    SES: new aws.SES({ region: "us-west-2", apiVersion: "2010-12-01" }),
  });
  return transporter.sendMail({
      from: `${senderName} <donotreplymattboentoro@gmail.com>`,
      to: "mattboentoro@yahoo.com",
      subject: `[From MyWebsite] ${subject}`,
      text: message,
      html: `<html><head><style> .title{ font-weight: 800;} .message { margin-top: 20px;}</style></head><body><div><span class='title'>Sender: </span><span>${senderName} (${senderEmail})</span></div><div><span class='title'>Subject: </span><span>${subject}</span></div><div><span class='title'>Date: </span><span>${date}</span></div><div class='message'>${message.replace(/\n/g,'<br/>')}</div></body></html>`,
  });
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