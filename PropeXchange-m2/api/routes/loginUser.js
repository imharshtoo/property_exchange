/* eslint-disable no-console */
import jwt from 'jsonwebtoken';
import passport from 'passport';
import jwtSecret from '../config/jwtConfig.js';
import {User} from '../sequelize.js';

export default (app) => {
  app.post('/loginUser', (req, res, next) => {
    passport.authenticate('login', (err, users, info) => {
      if (err) {
        console.error(`error ${err}`);
      }
      if (info !== undefined) {
        console.error(info.message);
        if (info.message === 'bad username' || info.message === 'OTP generated') {
          res.status(401).send(info.message);
        } else {
          res.status(403).send(info.message);
        }
      } else {
        req.logIn(users, () => {
          User.findOne({
            where: {
              username: req.body.username,
            },
          }).then(user => {
            const token = jwt.sign({ id: user.userId }, jwtSecret, {
              expiresIn: 6000 * 60000000,
            });
            res.status(200).send({
              auth: true,
              username: user.username,
              token,
              message: 'user found & logged in',
            });
          });
        });
      }
    })(req, res, next);
  });
};
