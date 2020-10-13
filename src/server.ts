import express from 'express'
import cors from 'cors'
import path from 'path'

import './database/connection'
import routes from './routes'
import errorHandler from './errors/handler'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(routes)
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))
app.use(errorHandler)

app.listen(7070, () => console.log('server is running'))