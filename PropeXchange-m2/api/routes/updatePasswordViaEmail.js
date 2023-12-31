/* eslint-disable no-console */
import bcrypt from 'bcrypt';
import Sequelize from 'sequelize';
import {User} from '../sequelize.js';
import {validatePassword} from '../utils/helperUtil.js';
// eslint-disable-next-line prefer-destructuring
const Op = Sequelize.Op;


const BCRYPT_SALT_ROUNDS = 12;
export default (app) => {
  app.put('/updatePasswordViaEmail', (req, res) => {
    if(!validatePassword(req.body.password)) {
      res.status(401).send({ message: 'Invalid Password! Must contain atleast 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 special character.' });
    }
    User.findOne({
      where: {
        username: req.body.username,
        resetPasswordToken: req.body.resetPasswordToken,
        resetPasswordExpires: {
          [Op.gt]: Date.now(),
        },
      },
    }).then(user => {
      if (user == null) {
        console.error('password reset link is invalid or has expired');
        res.status(403).send('password reset link is invalid or has expired');
      } else if (user != null) {
        console.log('user exists in db');
        bcrypt
          .hash(req.body.password, BCRYPT_SALT_ROUNDS)
          .then(hashedPassword => {
            user.update({
              password: hashedPassword,
              resetPasswordToken: null,
              resetPasswordExpires: null,
            });
          })
          .then(() => {
            console.log('password updated');
            res.status(200).send({ message: 'password updated' });
          });
      } else {
        console.error('no user exists in db to update');
        res.status(401).json('no user exists in db to update');
      }
    });
  });
};
