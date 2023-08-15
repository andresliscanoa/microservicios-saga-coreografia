'use strict'
if ( process.env.NODE_ENV === 'development' ) require( 'dotenv' ).config()
const Logger = require( './src/factory/Logger' )
const logger = new Logger( 'EXPRESS' )
const port = process.env.PORT || 3000
const app = require( './src/factory/Express' )
const {database} = require('./src/factory/Sequelize')
try {
    app.listen(port, () => {
        logger.info("enviroment", {...process.env})
        database
        logger.info( `Server listening on port: ${ port } in mode ${ process.env.NODE_ENV } ` )
        require( './src/factory/Routes' )( app )
    })
} catch (error) {
    const { message, stack } = error
    logger.error( 'Error de inicialización de servidor', { error: [ { message, stack } ] } )
}