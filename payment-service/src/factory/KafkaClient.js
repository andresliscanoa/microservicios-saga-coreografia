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
], (topic,error) => {
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
const producerPaymentCreatedEvent = new kafka.Producer(client);
producerPaymentCreatedEvent.on('ready', () => {
    const payload = [
        {
            topic: process.env.KAFKA_PAYMENT_CREATED_TOPIC,
            messages: 'Hello!'
        }
    ];
    producerPaymentCreatedEvent.send(payload, (error, data) => {
        if (error) {
            console.error('Error in publishing message:', error);
        } else {
            console.log('Message successfully published:', data);
        }
    });
});
producerPaymentCreatedEvent.on('error', (error) => {
    console.error('Error connecting to Kafka:', error);
});
// Consume messages from Kafka broker
consumerOrderCreatedEvents.on('message', async (message) => {
    try{
        const data = JSON.parse(message.value)
        logger.info("ORDER CREATED EVENT", {...data});
        if(INITIAL_AMOUNT - data.data.amount > 0) {
            INITIAL_AMOUNT -=data.data.amount
            data.data.statement = "APPROVED"
            await PaymentController.savePayment(data)
        } else {
            data.data.statement = "INSUFFICIENT BALANCE"
            await PaymentController.savePayment(data)
        }
    } catch (error) {
        logger.error("ERROR", {...error})
    }
});