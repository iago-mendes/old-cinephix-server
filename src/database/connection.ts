import mongoose from 'mongoose'

import { password, dbname } from '../config/credentials'

mongoose.connect(
    `mongodb+srv://iago:${password}@cinephix-server.5qsvw.mongodb.net/${dbname}?retryWrites=true&w=majority`,
    {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}
)
mongoose.connection
.once('open', () => console.log('connection has been made'))
.on('error', (error: Error) => console.log('[connection error]: ', error))