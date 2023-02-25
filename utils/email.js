// //HANDLES ALL THE MAIL FUNCTIONALITY ACROSS OUR APPLICATION
// const nodemailer = require("nodemailer");
// const ejs = require("ejs");
// const htmlToText = require("html-to-text");
// const mailGun = require("nodemailer-mailgun-transport");

// //EMAIL CLASS TO CREATE MULTIPLE EMAILS
// module.exports = class Email {
//   constructor(user, url) {
//     this.to = user.email;
//     this.userName = user.username;
//     this.url = url;
//     this.from = `Ade from Circle-7 ${process.env.EMAIL_FROM}`;
//   }
//   newTransport() {
//     // if (process.env.NODE_ENV === "production") {
//       //USE Mailgun
//       const mailgunAuth = {
//         auth: {
//           api_key: process.env.MAILGUN_API,
//           domain: process.env.MAILGUN_DOMAIN,
//         },
//       };
//       return nodemailer.createTransport(mailGun(mailgunAuth));
//     // }
//     // return nodemailer.createTransport({
//     //   host: process.env.EMAIL_HOST,
//     //   port: process.env.EMAIL_PORT,
//     //   auth: {
//     //     user: process.env.EMAIL_USER,
//     //     pass: process.env.EMAIL_PASSWORD,
//     //   },
//     // });
//   }

//   // SEND THE ACTUAL EMAIL
//   async send(template, subject) {
//     //1. RENDER HTML BASED BODY
//     let html;
//     ejs.renderFile(
//       `${__dirname}/../views/emails/${template}.ejs`,
//       {
//         username: this.userName,
//         url: this.url,
//         subject,
//       },
//       function (err, data) {
//         console.log('Data', data);
//         html = data;
//       }
//     );

//     //2. DEFINE MAIL OPTIONS
//     const mailOptions = {
//       from: this.from,
//       to: this.to,
//       subject,
//       html,
//       // text: htmlToText.fromString(html, {
//       //   ignoreImage: true,
//       //   tables: true,
//       //   wordwrap: false,
//       // }),
//     };

//     //3. Create a transport and send email
//     await this.newTransport().sendMail(mailOptions);
//   }

//   //EXTEND THE MAIL FUNCTION TO SEND MAIL FOR WELCOMING NEW USERS.
//   async sendWelcome() {
//     await this.send("welcomeMail", "Welcome to the circle!");
//   }
//   //EXTEND THE MAIL FUNCTION TO SEND MAIL FOR SENDING PASSWORD RESET.
//   async sendPasswordReset() {
//     await this.send(
//       "resetPassword",
//       "Your password reset token(valid for only 10 minutes)"
//     );
//   }
//   //EXTEND THE MAIL FUNCTION TO SEND MAIL FOR WELCOMING NEW USERS.
//   async sendVerifiedPR() {
//     await this.send('verifiedPR', 'Your password has successfully changed.')
//   }

//   // SEND MAIL TO PROCEED WITH DEACTIVATION
//   async sendDeactivation() {
//     await this.send('requestDeactivation', 'Deactivate your account')
//   }

//   // SEND MAIL TO PROCEED WITH DEACTIVATION
//   async sendDeactivationConfirmation() {
//     await this.send('confirmDeactivation', 'Your account has been deactivated')
//   }

//   // SEND MAIL TO PROCEED WITH DEACTIVATION
//   async sendConfirmReactivation() {
//     await this.send('confirmReactivation', 'Your account has been reactivated')
//   }
// };


//HANDLES ALL THE MAIL FUNCTIONALITY ACROSS OUR APPLICATION
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const htmlToText = require("html-to-text");
const mailGun = require("nodemailer-mailgun-transport");
//EMAIL CLASS TO CREATE MULTIPLE EMAILS
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.userName = user.username;
    this.url = url;
    this.from = `Ade from Circle-7 ${process.env.EMAIL_FROM}`;
  }
  newTransport() {
    // if (process.env.NODE_ENV === "production") {
      //USE Mailgun
      const mailgunAuth = {
        auth: {
          api_key: process.env.MAILGUN_API,
          domain: process.env.MAILGUN_DOMAIN,
        },
      };
      return nodemailer.createTransport(mailGun(mailgunAuth));
    // }
    // return nodemailer.createTransport({
    //   host: process.env.EMAIL_HOST,
    //   port: process.env.EMAIL_PORT,
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    // });
  }
  // SEND THE ACTUAL EMAIL
  async send(template, subject) {
    //1. RENDER HTML BASED BODY
    let html;
    ejs.renderFile(
      `${__dirname}/../views/emails/${template}.ejs`,
      {
        username: this.userName,
        url: this.url,
        subject,
      },
      function (err, data) {
        html = data;
      }
    );
    //2. DEFINE MAIL OPTIONS
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      // text: htmlToText.fromString(html, {
      //   ignoreImage: true,
      //   tables: true,
      //   wordwrap: false,
      // }),
    };
    //3. Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }
  //EXTEND THE MAIL FUNCTION TO SEND MAIL FOR WELCOMING NEW USERS.
  async sendWelcome() {
    await this.send("welcomeMail", "Welcome to the circle!");
  }
  //EXTEND THE MAIL FUNCTION TO SEND MAIL FOR SENDING PASSWORD RESET.
  async sendPasswordReset() {
    await this.send(
      "resetPassword",
      "Your password reset token(valid for only 10 minutes)"
    );
  }
  //EXTEND THE MAIL FUNCTION TO SEND MAIL FOR WELCOMING NEW USERS.
  async sendVerifiedPR() {
    await this.send('verifiedPR', 'Your password has successfully changed.')
  }

  // SEND PROFILE DEACTIVATION MAIL
  async sendDeactivation() {
    await this.send('requestDeactivation', 'Deactivate your account')
  }
};