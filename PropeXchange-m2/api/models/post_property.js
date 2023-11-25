const PropertyModel = (sequelize, type) => sequelize.define('Property', {
    id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        },
        imagefile:type.BLOB('long'),
        state:type.STRING,
        address:type.STRING,
        pincode:type.INTEGER,
        district:type.STRING,
        apartment: type.STRING,
        apartmentname:type.STRING,
        bhk: type.STRING,
        floor: type.INTEGER,
        totalfloor: type.STRING,
        propertyage: type.STRING,
        expectedrent: {
        type: type.INTEGER,
        allowNull: false,
        },
        expectedDepost: {
        type: type.INTEGER,
        allowNull: false},
        status: {
            type: type.ENUM('available', 'blacklist', 'soldout'),
            defaultValue: 'available',
        },
        date:type.DATEONLY 
});

export default PropertyModel;