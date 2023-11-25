/* eslint-disable max-len */
/* eslint-disable no-console */
import crypto from 'crypto';
import {User} from '../sequelize.js';

import dotenv from 'dotenv';

dotenv.config();
import nodemailer from 'nodemailer';


export default (app) => {
  app.post('/forgotPassword', (req, res) => {
    if (req.body.email === '') {
      res.status(400).send('email required');
    }
    console.error(req.body.email);
    User.findOne({
      where: {
        email: req.body.email,
      },
    }).then(async (user) => {
      if (user === null) {
        console.error('email not in database');
        res.status(403).send('email not in db');
      } else {
        const token = crypto.randomBytes(20).toString('hex');
        user.update({
          resetPasswordToken: token,
          resetPasswordExpires: Date.now() + 3600000,
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
          subject: 'Link To Reset Password',
          text:
            'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
            + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
            + `${process.env.CLIENT_URL}/reset/${token}\n\n`
            + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
        };

        console.log('sending mail');

        transporter.sendMail(mailOptions, (err, response) => {
          if (err) {
            console.error('there was an error: ', err);
          } else {
            console.log('here is the res: ', response);
            res.status(200).json('recovery email sent');
          }
        });
      }
    });
  });
};
