import {User, Property as property,sequelize} from '../sequelize.js';
import passport from 'passport';
export default (app) => {
    app.put('/updateproperty', (req, res, next) => {
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
                    'UPDATE properties SET ' +
                    'apartment = :apartment, ' +
                    'apartmentname = :apartmentname, ' +
                    'bhk = :bhk, ' +
                    'floor = :floor, ' +
                    'totalfloor = :totalfloor, ' +
                    'expectedrent = :expectedrent, ' +
                    'expectedDepost = :expectedDepost, ' +
                    'state = :state, ' +
                    'propertyage = :propertyage, ' +
                    'district = :district, ' +
                    'pincode = :pincode, ' +
                    'address = :address,' +
                    'date = :date '+
                    'WHERE userId = :userId AND id = :id',
                    {
                    replacements: {
                        userId: userInfo.userId,
                        id: req.body.id,
                        apartment: req.body.apartment,
                        apartmentname: req.body.apartmentname,
                        bhk: req.body.bhk,
                        floor: req.body.floor,
                        totalfloor: req.body.totalfloor,
                        expectedrent: req.body.expectedrent,
                        expectedDepost: req.body.expectedDepost,
                        state: req.body.state,
                        propertyage: req.body.propertyage,
                        district: req.body.district,
                        pincode: req.body.pincode,
                        address: req.body.address,
                        date:req.body.date,
                    },
                        type: sequelize.QueryTypes.UPDATE,
                    }
                ).then(result => {
                    res.status(200).send(result);
                }).catch((error) => {
                    console.log(error);
                    res.status(401).send("not able to update data!")
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
