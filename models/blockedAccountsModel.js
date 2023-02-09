
module.exports = (sequelize, DataTypes) => {
    const blockAccounts = sequelize.define(
        "blockedAccounts",
        {
            // blockedBy: {
            //     type: DataTypes.INTEGER,
            //     // references: {
            //     //     model: userModel,
            //     //     key: 'id'
            //     // }
            // },

            blockedUser: {
                type: DataTypes.INTEGER,
                // references: {
                //     model: userModel,
                //     key: 'id'
                // }
            },

        },
    )
    return blockAccounts;
}