import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();


const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_UID, process.env.DB_PWD, {
  host: '127.0.0.1',
  dialect: 'mysql',
});

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database: ', error);
});
import UserModel from './models/user.js';
import PropertyModel from './models/post_property.js';
import Paymentmodel from "./models/payment.js";
const Payment=Paymentmodel(sequelize,DataTypes);
sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
  console.log('The db and user table have been created');
});
const User = UserModel(sequelize, DataTypes);
sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
  console.log('The db and user table have been created');
});
const Property=PropertyModel(sequelize,DataTypes);
sequelize.sync().then(()=>{
  console.log("Property table has been created!!");
});
User.hasMany(Property,{foreignKey:'userId'});
console.log("user",User);

export { User, Property ,sequelize,Payment};
