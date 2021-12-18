const nodemailer = require("nodemailer");

const sendEmail = (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.SERVICE,
            auth: {
                user: process.env.USER,
                pass: process.env.PASS,
            },
        });
        
        const mailOptions = {
            from: process.env.USER,
            to: email,
            subject: subject,
            text: text,
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error)
            }
            else {
                console.log("Email sent successfully: "+ info.response)
            }
        });
    } 
    catch (error) {
        console.log(error, "email not sent");
    }
};

module.exports = sendEmail;