'use strict'
if ( process.env.NODE_ENV === 'development' ) require( 'dotenv' ).config()
const kafka = require('kafka-node')
const Logger = require( './Logger' )
const logger = new Logger( 'KAFKA' )
const PaymentController = require('../controller/PaymentController')
let INITIAL_AMOUNT = 50000.00
const client = new kafka.KafkaClient({
    kafkaHost: process.env.KAFKA_HOST
})
client.createTopics([
    {topic: process.env.KAFKA_ORDER_CREATED_TOPIC, partitions: 1, replicationFactor: 1}
], (error, topic) => {
    if(error) logger.error('Error creating topic', {...error});
    else logger.info("TOPIC", {...topic})
});
client.on('ready', () => {
    logger.info('Kafka Connected');
});
client.on('error', (error) => {
    logger.error('Error connecting to Kafka:', error);
});

const consumerOrderCreatedEvents = new kafka.Consumer(
    new kafka.KafkaClient({kafkaHost: process.env.KAFKA_HOST}),
    [{ topic: process.env.KAFKA_ORDER_CREATED_TOPIC }],
    {groupId: process.env.KAFKA_ORDER_CREATED_GROUP}
);
consumerOrderCreatedEvents.on('message', async (message) => {
    let event = 'payment-created'
    const data = JSON.parse(message.value)
    try{
        logger.info("ORDER CREATED EVENT", {...data});
        if(INITIAL_AMOUNT - data.data.amount > 0) {
            INITIAL_AMOUNT -=data.data.amount
            data.data.statement = "APPROVED"
            data.data.paymentStatus = "APPROVED"
        } else {
            event= 'payment-invalid'
            data.data.statement = "INSUFFICIENT BALANCE"
            data.data.paymentStatus = "DENY"
        }
        await PaymentController.savePayment(data)
    } catch (error) {
        logger.error("ERROR", {...error})
        event= 'payment-invalid'
        data.data.statement = "TRANSACTIONAL ERROR"
        data.data.paymentStatus = "ERROR"
    } finally {
        const producerPaymentEvent = new kafka.Producer(new kafka.KafkaClient({kafkaHost: process.env.KAFKA_HOST}));
        producerPaymentEvent.on('error', (error) => {
            logger.error('Error connecting to Kafka producer:', error);
        });
        producerPaymentEvent.on('ready', () => {
            const payload = [
                {
                    topic: event === 'payment-created' ? process.env.KAFKA_PAYMENT_CREATED_TOPIC : process.env.KAFKA_PAYMENT_INVALID_TOPIC,
                    messages: JSON.stringify({
                        event: event,
                        data: {
                            transactionId: data.data.transactionId,
                            paymentStatus: data.data.paymentStatus,
                            statement: data.data.statement
                        }
                    })
                }
            ];
            producerPaymentEvent.send(payload, (error, data) => {
                if (error) {
                    logger.error('Error in publishing message:', {...error});
                } else {
                    logger.info('Message successfully published:', {...data});
                }
            });
        });
    }
});