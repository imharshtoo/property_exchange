/* eslint-disable no-console */
import passport from 'passport';
import {User} from '../sequelize.js';


export default (app) => {
  app.get('/get-poi', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
        console.log(err);
      }
      if (info !== undefined) {
        console.log(info.message);
        res.status(401).send(info.message);
      } else if (user.username === req.query.username) {
        User.findOne({
          where: {
            username: req.query.username,
          },
        }).then((userInfo) => {
          if (userInfo != null) {
            const pdf = user.proofid;
            //console.log(pdf);
            res.setHeader('Content-Type', 'application/pdf');
            res.status(200).send(pdf);
          } else {
            console.error('no user exists in db with that username');
            res.status(401).send('no user exists in db with that username');
          }
        });
      } else {
        console.error('jwt id and username do not match');
        res.status(403).send('username and jwt token do not match');
      }
    })(req, res, next);
  });
};
