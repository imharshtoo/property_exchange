import { User, Property as property } from '../sequelize.js';
import passport from 'passport';
import multer from 'multer';
import fs from 'fs';

const storage = multer.diskStorage({
destination: (req, file, cb) => {
    cb(null, 'uploads/');
},
filename: (req, file, cb) => {
    cb(null, file.originalname);
},
});

const upload = multer({ storage: storage });

export default (app) => {
    app.post('/postyourproperty', upload.single('imagefile'), (req, res, next) => {
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        if (info !== undefined) {
            console.error(info.message);
            return res.status(403).send(info.message);
        }

        User.findOne({
            where: {
            username: user.username,
            },
        })
            .then((userInfo) => {
            if (userInfo != null) {
                // Read the uploaded file
                const fileData = fs.readFileSync(req.file.path);

                // Remove the temporary file
                fs.unlink(req.file.path, (unlinkError) => {
                if (unlinkError) {
                    console.error('Error deleting temporary file:', unlinkError);
                }

                property
                    .create({
                    userId: userInfo.userId,
                    state: req.body.state,
                    address: req.body.address,
                    pincode: req.body.pincode,
                    district: req.body.district,
                    apartment: req.body.apartment,
                    imagefile: fileData, // Use the file provided by multer
                    apartmentname: req.body.apartmentname,
                    bhk: req.body.bhk,
                    floor: req.body.floor,
                    totalfloor: req.body.totalfloor,
                    propertyage: req.body.propertyage,
                    expectedrent: req.body.expectedrent,
                    expectedDepost: req.body.expectedDepost,
                    date: req.body.date,
                    })
                    .then(() => {
                    console.log('Property added');
                    res.status(200).send({ auth: true, message: 'Property added' });
                    })
                    .catch((error) => {
                    console.error('Error creating property:', error);
                    res.status(500).send('Internal Server Error');
                    });
                });
            } else {
                console.error('No user exists in the database to update');
                res.status(401).send('No user exists in the database to update');
            }
            })
            .catch((error) => {
            console.error('Error finding user:', error);
            res.status(500).send('Internal Server Error');
            });
        })(req, res,next);
    });
};