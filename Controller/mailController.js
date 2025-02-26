const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  }
});

const sendMail = (to, subject, html) => {  
  const mailOptions = {
    from: `"Event Planner" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: subject,
    html: html  
  };

  return transporter.sendMail(mailOptions);
};






const sendEmailWithAttachment = async (toEmail, subject, html, pdfPath) => {
    try {
        const transporter = nodemailer.createTransport({
          service: 'Gmail', 
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASSWORD,
            }
        });
        const mailOptions = {
            from:`"Event Planner" <${process.env.EMAIL_USER}>`,
            to: toEmail, 
            subject: subject,
            html: html ,
            attachments: [
                {
                    filename: "Quotation.pdf",
                    path: pdfPath 
                }
            ]
        };
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.response);
        return { success: true, message: "Email sent successfully" };
    } catch (error) {
        console.error("Email sending error:", error);
        return { success: false, message: error.message };
    }
};

module.exports = {sendEmailWithAttachment,sendMail};
