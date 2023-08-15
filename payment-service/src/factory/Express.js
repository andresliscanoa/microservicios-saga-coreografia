'use strict'
if(process.env.NODE_ENV==='development')require( 'dotenv' ).config()
const express = require( 'express' )
const morgan = require( 'morgan' )
const app = express()
app.set( 'trust proxy', 1 )
app.use(express.json())
app.use( morgan( process.env.NODE_ENV === 'development' ? 'dev' : 'short' ) )
module.exports = app