/* eslint-disable no-console */
/* eslint-disable max-len */
import Sequelize from 'sequelize';
import {User} from '../sequelize.js';

// eslint-disable-next-line prefer-destructuring
const Op = Sequelize.Op;



export default (app) => {
  app.get('/verify', (req, res) => {
    User.findOne({
      where: {
        verifyProfileToken: req.query.verifyProfileToken,
        verificationTokenExpires: {
          [Op.gt]: Date.now(),
        },
      },
    }).then((user) => {
      if (user == null) {
        console.error('verification link is invalid or has expired');
        res.status(403).send('verification link is invalid or has expired');
      } else {
        res.status(200).send({
          username: user.username,
          message: 'verification link a-ok',
        });
      }
    });
  });
};
