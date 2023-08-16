'use strict'
const Logger = require('../factory/Logger')
const logger = new Logger("PAYMENT_CONTROLLER")
const Payment = require('../entity/Payment')


const savePayment = async ({...args}) => {
        logger.info("ARGUMENTS", {...args})
        return Payment.create({
            transactionId: args.data.transactionId,
            userId: args.data.userId,
            amount: args.data.amount,
            paymentStatus: args.data.paymentStatus,
            statement: args.data.statement
        })
}

module.exports = {savePayment}