'use strict'
const Sequelize = require("sequelize");
require( 'dotenv' ).config()
const Logger = require( './Logger' )
const logger = new Logger( 'SEQUELIZE' )
const sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    {
        host: process.env.DATABASE_HOST,
        dialect: process.env.DATABASE_DIALECT
    })
const database = sequelize.authenticate().then(() => {
    logger.info('Connection has been established successfully.');
}).catch((error) => {
    logger.error('Unable to connect to the database: ', error);
})
module.exports.database = database