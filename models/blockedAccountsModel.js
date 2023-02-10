
module.exports = (sequelize, DataTypes) => {
    const blockAccounts = sequelize.define(
        "blockedAccounts",
        {
            userId: {
                type: DataTypes.INTEGER,
            },

            blockedUser: {
                type: DataTypes.INTEGER,
            },

        },
    )
    return blockAccounts;
}