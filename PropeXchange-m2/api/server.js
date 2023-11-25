import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import logger from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
//import passport from 'passport';
import helmet from 'helmet';

const app = express();
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });
const API_PORT = process.env.API_PORT || 3003;

const swaggerDefinition = {
  info: {
    title: 'MySQL Registration Swagger API',
    version: '1.0.0',
    description: 'Endpoints to test the user registration routes',
  },
  host: 'localhost:3003',
  basePath: '/',
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      scheme: 'bearer',
      in: 'header',
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

import passport from './config/passport.js';

const whitelist = [
  'http://192.168.2.247:3000',
  'http://192.168.2.247:3003',
  'http://192.168.2.247:3000',
  'http://localhost:3000',
];


const corsOptions = {
  origin: function (origin, callback) {
    console.log("Origin URL: ",origin);
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(helmet());
app.use(passport.initialize());

import loginUserRoute from './routes/loginUser.js';
import registerUserRoute from './routes/registerUser.js';
import forgotPasswordRoute from './routes/forgotPassword.js';
import resetPasswordRoute from './routes/resetPassword.js';
import updatePasswordRoute from './routes/updatePassword.js';
import updatePasswordViaEmailRoute from './routes/updatePasswordViaEmail.js';
import findUsersRoute from './routes/findUsers.js';
import deleteUserRoute from './routes/deleteUser.js';
import updateUserRoute from './routes/updateUser.js';
import postPropertyRoute from './routes/postProperty.js';
import bookeditems from './routes/bookeditems.js';
import deleteproperty from './routes/deleteproperty.js';
import updateproperty from './routes/updateproperty.js';
import verifyProfile from './routes/verifyProfile.js';
import signPDF from './utils/signPDF.js';
import profilekyc from './routes/profilekyc.js';
import getidproof from './routes/getidproof.js';
import searchitems from "./routes/searchitem.js";
getidproof(app);
profilekyc(app);
loginUserRoute(app);
registerUserRoute(app);
forgotPasswordRoute(app);
resetPasswordRoute(app);
updatePasswordRoute(app);
updatePasswordViaEmailRoute(app);
findUsersRoute(app);
deleteUserRoute(app);
updateUserRoute(app);
postPropertyRoute(app);
bookeditems(app);
deleteproperty(app);
verifyProfile(app);
signPDF(app);
updateproperty(app);
searchitems(app);
app.get('/', function (req, res) {
  res.send('Server Running!!!');
})
// eslint-disable-next-line no-console
app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));

export default app;
