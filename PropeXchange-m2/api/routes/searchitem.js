/* eslint-disable no-console */
import passport from 'passport';
import {User,sequelize} from '../sequelize.js';


export default (app) => {
    app.post('/searchitems', (req, res, next) => {
        console.log(req.headers);
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err) {
                console.error(err);
            }
            if (info !== undefined) {
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
                    sequelize.query(
                        'SELECT * FROM properties where state=:st and pincode=:pc and bhk=:bk and apartment=:apt and status=:avb and expectedrent<=:rt ',
                        {
                            replacements: {st:req.body.location,pc:req.body.pincode,er:req.body.Budget,bk:req.body.bhk,apt:req.body.type,id:userInfo.userId,avb:"available",rt:req.body.Budget},
                            type: sequelize.QueryTypes.SELECT
                        }
                    ).then(result => {
                        res.status(200).send(result);
                    }).catch((error) => {
                        res.status(401).send("not able to fetch data!")
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
