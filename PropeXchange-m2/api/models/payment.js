const Payment = (sequelize, type) => sequelize.define('Payment', {
    id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        },
        propertyid:{
            type:type.INTEGER,
        },
    SellerID: {
        type: type.UUID,
        },
    BuyerID: {
        type: type.UUID,
        },
    TransactonID: {
        type: type.STRING,
        },
    });
export default Payment;