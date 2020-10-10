import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import { password, dbname } from './config/credentials'
import routes from './routes'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

mongoose.connect(
    `mongodb+srv://iago:${password}@cinephix-server.5qsvw.mongodb.net/${dbname}?retryWrites=true&w=majority`,
    {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}
)
mongoose.connection
.once('open', () => console.log('connection has been made'))
.on('error', (error: Error) => console.log('[connection error]: ', error))

app.use(routes)

app.listen(7070, () => console.log('server is running'))