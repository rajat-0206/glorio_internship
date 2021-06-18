require("dotenv").config();
const nodemailer = require('nodemailer');


const mailer = (recipient,subject,html,callback=()=>{}) => {
nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  }).sendMail({from:process.env.EMAIL,to:recipient,subject,html}, (error, info)=>{
    if (error) {
        return false;
    } else {
        callback();
    }
  })

}

module.exports = mailer;
