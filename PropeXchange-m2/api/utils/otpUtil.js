import crypto from 'crypto';
import {User} from '../sequelize.js';
import swaggerJSDoc from 'swagger-jsdoc';

import dotenv from 'dotenv';

dotenv.config();

import nodemailer from 'nodemailer';

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
};

async function sendOTP(username) {
    if(username === null || username === ''){
        throw new Error('Invalid Username!');
    }
    User.findOne({
        where: {
            username,
        },
      }).then(async (user) => {
        if (user === null) {
          console.error('user not in database');
          throw new Error('user not in database');
        } else {
          const token = generateOTP();
          user.update({
            otpToken: token,
            otpExpires: Date.now() + 300000,
          });
          let testAccount = await nodemailer.createTestAccount();
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: `${process.env.EMAIL_ADDR}`,
              pass: `${process.env.APP_PWD}`,
            },
          });
        //   const transporter = nodemailer.createTransport({
        //     host: 'smtp.ethereal.email',
        //     port: 587,
        //     auth: {
        //         user: `${process.env.EMAIL_ADDRESS}`,
        //         pass: `${process.env.EMAIL_PASSWORD}`,
        //     }
        // });
          const mailOptions = {
            from: 'no-reply@propexchange.com',
            to: `${user.email}`,
            subject: 'OTP for Login',
            text:
              'You are receiving this because you (or someone else) have requested the OTP to login your account.\n\n'
              + `Your OTP for verification is ${token}, it will expire after 5 minutes.\n\n`
              + 'If you did not request this, please change your password.\n',
          };
  
          console.log('sending mail');
  
          transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
              console.error('there was an error: ', err);
              throw new Error(`there was an error:  ${err}`);
            } else {
              console.log('here is the res: ', response);
            }
          });
        }
      });
    return 'OTP sent successfully';
  }

export { sendOTP, generateOTP };