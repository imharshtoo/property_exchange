import crypto from 'crypto';
import {User} from '../sequelize.js';
import swaggerJSDoc from 'swagger-jsdoc';

import dotenv from 'dotenv';

dotenv.config();

import nodemailer from 'nodemailer';

const generateToken = (id) => {
  const hash = crypto.createHash('sha256').update(id.toString()).digest('hex');
  const token = crypto.randomBytes(10).toString('hex')+ hash + crypto.randomBytes(10).toString('hex');
  return token;
};

async function sendVerficationLink(username) {
    if(username === null || username === ''){
        throw new Error('Invalid Username!');
    }
    User.findOne({
        where: {
            username,
            status: 'unverified',
        },
      }).then(async (user) => {
        if (user === null) {
          console.error('user not in database');
          throw new Error('user not in database');
        } else {
          const token = generateToken(user.userId);
          user.update({
            verifyProfileToken: token,
            verificationTokenExpires: Date.now() + 3000000,
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
            subject: 'Verify Profile',
            text:
            'Thank You for registering on PropeXchange. To Complete your registration and verify your profile please click the link below.\n\n'
            + 'Verification Link:\n'
            + `${process.env.CLIENT_URL}/verify/${token}\n\n`
            + 'The link will expire after 5 minutes.\n\n'
            + 'Please Ignore, if you have already completed your profile verification.\n',
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

export { sendVerficationLink };