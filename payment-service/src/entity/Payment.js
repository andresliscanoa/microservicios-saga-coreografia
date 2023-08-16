'use strict'
const { DataTypes } = require("sequelize")
const {database} = require('../factory/Sequelize')

const Payment = database.define("Payment", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    transactionId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "transaction_id"
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "user_id"
    },
    amount: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    paymentStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "PENDING",
        field: "payment_status"
    },
    statement: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'payment'
})

module.exports = Payment