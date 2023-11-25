/* eslint-disable no-console */
import passport from 'passport';
import {User,sequelize,Property} from '../sequelize.js';


export default (app) => {
    app.delete('/deleteproperty', (req, res, next) => {
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err) {
                console.error(err);
            }
            if (info !== undefined) {
                console.log(info);
                console.error(info.message);
                res.status(403).send(info.message);
            } else {
                User.findOne({
                where: {
                    username: user.username,
                },
                }).then((userInfo) => {
                if (userInfo != null) {
                    console.log('user found in db');
                    Property.destroy({
                        where: {
                            userId:userInfo.userId,
                            id: req.body.id,
                        },
                    })
                        .then(() => {
                            console.log('Property deleted');
                            res.status(200).send('Property deleted');
                        })
                        .catch((error) => {
                            console.error('Error deleting property', error);
                            res.status(500).send('Error deleting property');
                        });
                } else {
                    console.error('no user exists in db to update');
                    res.status(401).send('no user exists in db to update');
                }
                });
            }
        })(req, res, next);
    });
};
