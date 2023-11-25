/* eslint-disable camelcase */
/* eslint-disable consistent-return */
/* eslint-disable no-console */
import bcrypt from 'bcrypt';
import Sequelize from 'sequelize';
import jwtSecret from './jwtConfig.js';
import {sendOTP} from '../utils/otpUtil.js';

const BCRYPT_SALT_ROUNDS = 12;
// eslint-disable-next-line prefer-destructuring
const Op = Sequelize.Op;

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTstrategy, ExtractJwt as ExtractJWT } from 'passport-jwt';
import { User } from '../sequelize.js';
import { sendVerficationLink } from '../utils/sendVerificationLinkUtil.js';
import { validateUsername, validatePassword } from '../utils/helperUtil.js';

passport.use(
  'register',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
      session: false,
    },
    (req, username, password, done) => {
      if(!validateUsername(username) || !validatePassword(password)){
        return done(null, false, { message: 'Invalid username or password' });
      }
      try {
        User.findOne({
          where: {
            [Op.or]: [
              {
                username,
              },
              { email: req.body.email },
            ],
          },
        }).then(user => {
          if (user != null) {
            console.log('username or email already taken');
            return done(null, false, {
              message: 'username or email already taken',
            });
          }
          bcrypt.hash(password, BCRYPT_SALT_ROUNDS).then(hashedPassword => {
            User.create({
              username,
              password: hashedPassword,
              email: req.body.email,
            }).then(user => {
              console.log('user created');
              sendVerficationLink(username);
              return done(null, user);
            });
          });
        });
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
      session: false,
    },
    (req, username, password, done) => {
      if(!validateUsername(username) || !validatePassword(password)){
        return done(null, false, { message: 'Invalid username or password' });
      }
      try {
        User.findOne({
          where: {
            username,
          },
        }).then(user => {
          if (user === null) {
            return done(null, false, { message: 'bad username' });
          }
          if(user.status === 'blocked'){
            return done(null, false, { message: 'user blocked' });
          }
          if(user.status === 'unverified'){
            sendVerficationLink(user.username);
            return done(null, false, { message: 'user unverified' });
          }
          bcrypt.compare(password, user.password).then(response => {
            if (response !== true) {
              console.log('passwords do not match');
              return done(null, false, { message: 'passwords do not match' });
            }
            if(req.body.otp===null || req.body.otp===''){
              //generate otp
              sendOTP(username);
              console.log('OTP generated');
              return done(null, false, { message: 'OTP generated' });
            }
            if(req.body.otp!==user.otpToken || user.otpExpires===null || user.otpExpires < Date.now()){
              //verify otp
              console.log('OTP does not match or expired');
              if(user.otpExpires < Date.now()){
                user.update({
                  otpToken: null,
                  otpExpires: null,
                });
              }  
              return done(null, false, { message: 'OTP does not match or expired' });
            }
            user.update({
              otpToken: null,
              otpExpires: null,
            });
            console.log('user found & authenticated');
            return done(null, user);
          });
        });
      } catch (err) {
        done(err);
      }
    },
  ),
);

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: jwtSecret,
};

passport.use(
  'jwt',
  new JWTstrategy(opts, (jwt_payload, done) => {
    try {
      User.findOne({
        where: {
          userId: jwt_payload.id,
          status: 'verified',
        },
      }).then(user => {
        if (user) {
          console.log('user found in db in passport');
          done(null, user);
        } else {
          console.log('user not found in db');
          done(null, false);
        }
      });
    } catch (err) {
      done(err);
    }
  }),
);

export default passport;