module.exports = function(sequelize, Data) {
    var UserSchema = sequelize.define("User", {
        login: Data.STRING,
        password: Data.STRING,
        role: Data.INTEGER,

    },{
        timestamps: false
    });
    return UserSchema;
}