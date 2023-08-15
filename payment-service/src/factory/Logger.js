'use strict'
const winston = require( 'winston' )

class Logger {
    constructor( route ) {
        this.logger = winston.createLogger( {
            transports: [ new winston.transports.Console() ],
            format    : winston.format.printf( ( info ) => {
                let message = `| ${ new Date().toISOString() } | ${ info.level.toUpperCase() } | ${ route } | ${ info.message } |`
                message =
                    Object.keys( info.meta ).length ? message + ` data:${ JSON.stringify( info.meta ) } | ` : message
                return message
            } )
        } )
    }

    info( message, obj ) {
        this.logger.log( { level: 'info', message, meta: { ...obj } } )
    }

    error( message, obj ) {
        this.logger.log( { level: 'error', message, meta: { ...obj } } )
    }

    warn( message, obj ) {
        this.logger.log( { level: 'warn', message, meta: { ...obj } } )
    }
}

module.exports = Logger